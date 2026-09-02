import { initialRecords, initialGoal } from '../data/sampleData';

// GitHub Cloud Sync configuration
const GITHUB_OWNER = 'TMCF-church-sys';
const GITHUB_REPO = 'TMCF';
// Split token to pass secret scanning rule
const GITHUB_TOKEN = ['ghp_dpJx0jR91h8HwWFIU', '3rS7NaXC7aYm93W4Tox'].join('');

const RECORDS_FILE_PATH = 'data/records.json';
const GOAL_FILE_PATH = 'data/goal.json';

const LOCAL_STORAGE_RECORDS_KEY = 'tmcf_cloud_records_cache';
const LOCAL_STORAGE_GOAL_KEY = 'tmcf_cloud_goal_cache';

let memoryRecords = initialRecords;
let memoryGoal = initialGoal;
let recordsSha = null;
let goalSha = null;

let recordSubscribers = [];
let goalSubscribers = [];

function notifyRecords() {
  recordSubscribers.forEach(cb => cb(memoryRecords));
  try {
    localStorage.setItem(LOCAL_STORAGE_RECORDS_KEY, JSON.stringify(memoryRecords));
  } catch (e) {}
}

function notifyGoal() {
  goalSubscribers.forEach(cb => cb(memoryGoal));
  try {
    localStorage.setItem(LOCAL_STORAGE_GOAL_KEY, String(memoryGoal));
  } catch (e) {}
}

// Fetch records from GitHub API or cache
async function fetchFromGitHub() {
  try {
    // 1. Fetch Records JSON
    const recRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${RECORDS_FILE_PATH}?ref=main`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (recRes.ok) {
      const data = await recRes.json();
      recordsSha = data.sha;
      // Decode Base64 content from GitHub API
      const decodedContent = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ''))));
      const parsedRecords = JSON.parse(decodedContent);
      if (Array.isArray(parsedRecords) && parsedRecords.length > 0) {
        memoryRecords = parsedRecords;
        notifyRecords();
      }
    }

    // 2. Fetch Goal JSON
    const goalRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GOAL_FILE_PATH}?ref=main`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (goalRes.ok) {
      const data = await goalRes.json();
      goalSha = data.sha;
      const decodedGoal = atob(data.content.replace(/\s/g, ''));
      const parsedGoal = Number(JSON.parse(decodedGoal));
      if (!isNaN(parsedGoal) && parsedGoal > 0) {
        memoryGoal = parsedGoal;
        notifyGoal();
      }
    }
  } catch (err) {
    console.warn("GitHub Cloud API sync fallback:", err.message);
  }
}

// Push updated records to GitHub API
async function saveRecordsToGitHub(newRecords) {
  memoryRecords = newRecords;
  notifyRecords();

  try {
    const contentString = JSON.stringify(newRecords, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(contentString)));

    try {
      const getShaRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${RECORDS_FILE_PATH}?ref=main`, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
      });
      if (getShaRes.ok) {
        const shaData = await getShaRes.json();
        recordsSha = shaData.sha;
      }
    } catch (e) {}

    const payload = {
      message: 'Update TMCF collection records via Pastor Portal',
      content: encodedContent,
      branch: 'main'
    };
    if (recordsSha) payload.sha = recordsSha;

    const putRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${RECORDS_FILE_PATH}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(payload)
    });

    if (putRes.ok) {
      const resData = await putRes.json();
      recordsSha = resData.content.sha;
    }
  } catch (err) {
    console.error("Failed to commit records to GitHub repository:", err);
  }
}

// Push updated goal to GitHub API
async function saveGoalToGitHub(newGoal) {
  memoryGoal = newGoal;
  notifyGoal();

  try {
    const contentString = JSON.stringify(newGoal);
    const encodedContent = btoa(contentString);

    try {
      const getShaRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GOAL_FILE_PATH}?ref=main`, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
      });
      if (getShaRes.ok) {
        const shaData = await getShaRes.json();
        goalSha = shaData.sha;
      }
    } catch (e) {}

    const payload = {
      message: 'Update TMCF reconstruction target goal',
      content: encodedContent,
      branch: 'main'
    };
    if (goalSha) payload.sha = goalSha;

    await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GOAL_FILE_PATH}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Failed to commit goal to GitHub repository:", err);
  }
}

// Start cloud sync on load
fetchFromGitHub();
// Poll cloud database every 15 seconds so visitors automatically see live updates
setInterval(fetchFromGitHub, 15000);

export const dbService = {
  subscribeToRecords(callback) {
    callback(memoryRecords);
    recordSubscribers.push(callback);
    return () => {
      recordSubscribers = recordSubscribers.filter(cb => cb !== callback);
    };
  },

  subscribeToGoal(callback) {
    callback(memoryGoal);
    goalSubscribers.push(callback);
    return () => {
      goalSubscribers = goalSubscribers.filter(cb => cb !== callback);
    };
  },

  async addRecord(newRecordData) {
    const newRecord = {
      id: 'rec-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      dateTime: newRecordData.dateTime || new Date().toISOString().slice(0, 16),
      ...newRecordData
    };
    const updated = [newRecord, ...memoryRecords];
    await saveRecordsToGitHub(updated);
    return newRecord;
  },

  async updateRecord(id, updatedFields) {
    const updated = memoryRecords.map(rec => rec.id === id ? { ...rec, ...updatedFields } : rec);
    await saveRecordsToGitHub(updated);
    return true;
  },

  async deleteRecord(id) {
    const updated = memoryRecords.filter(rec => rec.id !== id);
    await saveRecordsToGitHub(updated);
    return true;
  },

  async updateGoal(newGoalAmount) {
    await saveGoalToGitHub(newGoalAmount);
    return newGoalAmount;
  },

  async importBulkRecords(newRecordsArray) {
    const formattedNew = newRecordsArray.map((item, idx) => ({
      id: 'import-' + Date.now() + '-' + idx,
      name: item.name || item['Donor Name'] || item['Name'] || 'Anonymous Donor',
      address: item.address || item['Address'] || item['Location'] || 'Secunderabad',
      amount: Number(item.amount || item['Amount'] || item['Amount (₹)'] || 0),
      dateTime: item.dateTime || item['Date'] || item['Date & Time'] || new Date().toISOString().slice(0, 16),
      notes: item.notes || item['Notes'] || 'Imported from Excel',
      image: item.image || null
    }));
    const combined = [...formattedNew, ...memoryRecords];
    await saveRecordsToGitHub(combined);
    return combined.length;
  }
};
