// geminiPrompts.js — AI Prompt Engine for Group Collaboration
// Uses Google Gemini Pro via @google/generative-ai
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function askGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    return { error: "GEMINI_API_KEY not configured in backend .env" };
  }
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    return { error: "AI response could not be parsed", raw: e.message };
  }
}

async function validateProject({ name, description, deadline, memberCount }) {
  const prompt = `You are a strict project input validator for a project management system.
A user submitted the following project details:
- Project name      : "${name}"
- Description       : "${description}"
- Deadline          : "${deadline}"
- Number of members : ${memberCount}

Your job is to check if this is a REAL, meaningful project — not random characters, not gibberish, not a test like "asdf" or "hhhh", and not too vague to be actionable.

Rules:
1. The name must be at least 3 meaningful words or a clear acronym.
2. The description must describe an actual goal or outcome (minimum 10 real words).
3. The deadline must be a future date.
4. Member count must be between 1 and 50.
5. If ANY rule fails, mark it invalid.

Respond ONLY with this JSON — no extra text:
{
  "valid": true or false,
  "reason": "Short, friendly explanation if invalid. Empty string if valid.",
  "detectedType": "One of: Software Development | Research | Event Planning | Business | Design | Education | Marketing | Other"
}`;
  return await askGemini(prompt);
}

async function suggestFunctions({ name, description, deadline, detectedType, memberCount, members }) {
  const memberList = members.map(m => `${m.name} (ID: ${m.id})`).join(", ");
  const prompt = `You are an expert project planner AI inside a project management tool.

Project context:
- Name        : "${name}"
- Description : "${description}"
- Type        : "${detectedType}"
- Deadline    : "${deadline}"
- Members (${memberCount}): ${memberList}

Your task: Suggest the most relevant project functions/components that this team needs to complete this project successfully.

Rules:
1. Suggest between 4 and 8 functions.
2. Each function must be SPECIFIC to this exact project.
3. Each function should be completable by one or two people.
4. The suggestedRole must be one of the provided member NAMES exactly as given.
5. The assignedUserId must be the ID of the member you assign.
6. Functions should cover the full lifecycle of the project.

Respond ONLY with this JSON — no extra text:
{
  "functions": [
    {
      "id": "fn_1",
      "name": "Short function name",
      "description": "One sentence explaining exactly what this involves.",
      "suggestedRole": "Member name exactly as provided",
      "assignedUserId": "the user ID string from the member list",
      "estimatedEffort": "Low | Medium | High"
    }
  ]
}`;
  return await askGemini(prompt);
}

async function generateMilestones({ name, description, detectedType, deadline, assignedFunctions }) {
  const fnList = assignedFunctions.map(f => `- ${f.name} (assigned to: ${f.assignedTo})`).join("\n");
  const prompt = `You are a project timeline expert AI inside a project management tool.

Project context:
- Name        : "${name}"
- Description : "${description}"
- Type        : "${detectedType}"
- Final deadline: "${deadline}"

Assigned project functions:
${fnList}

Your task: Generate a realistic milestone schedule between today and the final deadline.

Rules:
1. Create between 4 and 7 milestones.
2. Space them realistically.
3. The LAST milestone must be on or before the final deadline.
4. Each milestone should mark a meaningful checkpoint.
5. Link each milestone to 1–3 of the assigned function IDs.
6. Dates must be in ISO format (YYYY-MM-DD).

Respond ONLY with this JSON — no extra text:
{
  "milestones": [
    {
      "id": "ms_1",
      "title": "Milestone title",
      "date": "YYYY-MM-DD",
      "description": "What should be completed and ready by this date.",
      "linkedFunctions": ["fn_1", "fn_2"],
      "isCritical": true or false
    }
  ]
}`;
  return await askGemini(prompt);
}

async function generateDashboard({ name, description, detectedType, deadline, members, assignedFunctions, milestones }) {
  const fnSummary = assignedFunctions.map(f => `${f.name} → ${f.assignedTo}`).join(", ");
  const msSummary = milestones.map(m => `${m.title} (${m.date})`).join(", ");
  const memberNames = members.map(m => m.name).join(", ");
  const prompt = `You are a dashboard intelligence AI inside a project management tool.

Project: "${name}"
Type: "${detectedType}"
Description: "${description}"
Deadline: "${deadline}"
Members: ${memberNames}
Functions assigned: ${fnSummary}
Milestones: ${msSummary}

Generate the INITIAL seed data for 4 dashboard widgets. Since the project just started, set all progress to 0%.

Respond ONLY with this JSON — no extra text:
{
  "workloadHeatmap": {
    "description": "One line explaining what the heatmap is showing for this project.",
    "members": [{"name":"Member name","assignedFunctions":["fn_1"],"estimatedWeeklyHours":0,"workloadLevel":"Low | Medium | High"}]
  },
  "projectFlow": {
    "stages": [{"stage":"Stage name","status":"Not Started | In Progress | Completed","linkedMilestone":"ms_1","order":1}]
  },
  "roadmapMilestones": {
    "totalMilestones":0,"completedMilestones":0,
    "upcomingMilestone":{"title":"First milestone title","date":"YYYY-MM-DD","daysRemaining":0},
    "overallProgress":0
  },
  "activityFeed": {
    "latestActivities": [{"type":"project_created","message":"Project was created.","timestamp":"ISO timestamp"}]
  },
  "aiInsight": "One smart observation about this project's timeline or workload."
}`;
  return await askGemini(prompt);
}

async function generatePersonalTodos({ projectName, projectDescription, detectedType, deadline, memberName, assignedFunction, milestones }) {
  const related = (milestones || [])
    .filter(m => m.linkedFunctions && m.linkedFunctions.includes(assignedFunction.id))
    .map(m => `${m.title} due ${m.date}`).join(", ");
  const prompt = `You are a personal task planner AI inside a project management tool.

Project  : "${projectName}"
Type     : "${detectedType}"
Deadline : "${deadline}"

This to-do list is ONLY for: ${memberName}
Their assigned function: "${assignedFunction.name}" — ${assignedFunction.description}
Related milestones: ${related || "None directly linked"}

Generate a personal to-do list with 5 to 9 tasks specific to their function.

Respond ONLY with this JSON — no extra text:
{
  "memberName": "${memberName}",
  "functionName": "${assignedFunction.name}",
  "todos": [
    {
      "id": "todo_1",
      "task": "Specific, actionable task description",
      "priority": "High | Medium | Low",
      "estimatedHours": 2,
      "status": "not_started",
      "tip": "Expert-level advice specific to this task"
    }
  ]
}`;
  return await askGemini(prompt);
}

async function reAnalyzeDashboard({ projectName, deadline, milestones, memberProgress }) {
  const prog = memberProgress.map(m => `${m.name}: ${m.done} done, ${m.inProgress} in progress, ${m.skipped} skipped out of ${m.total} tasks`).join("\n");
  const msList = milestones.map(m => `${m.title} — due ${m.date} — ${m.isCritical ? "CRITICAL" : "normal"}`).join("\n");
  const prompt = `You are a project health AI monitoring a live project.

Project: "${projectName}"
Deadline: "${deadline}"

Current milestone schedule:
${msList}

Current member progress:
${prog}

Analyze and respond ONLY with this JSON — no extra text:
{
  "overallHealthScore": 0,
  "healthLabel": "On Track | At Risk | Behind | Critical",
  "updatedInsight": "One specific honest observation.",
  "risks": ["Risk 1","Risk 2"],
  "suggestion": "The single most important thing to do RIGHT NOW.",
  "predictedCompletion": "YYYY-MM-DD"
}`;
  return await askGemini(prompt);
}

async function generateMeetingAgenda({ projectName, meetingDate, memberProgress, upcomingMilestones }) {
  const prog = memberProgress.map(m => `${m.name}: ${m.done}/${m.total} done`).join(", ");
  const ms = upcomingMilestones.map(m => `${m.title} on ${m.date}`).join(", ");
  const prompt = `You are a meeting facilitator AI for a project management tool.

Project: "${projectName}"
Meeting date: "${meetingDate}"
Team progress: ${prog}
Upcoming milestones: ${ms}

Generate a focused meeting agenda under 45 minutes. Respond ONLY with this JSON — no extra text:
{
  "meetingTitle": "Short specific meeting title",
  "totalDuration": 30,
  "agenda": [
    {
      "order": 1,
      "item": "Agenda item description",
      "durationMinutes": 5,
      "owner": "Facilitator | All | Specific member name",
      "purpose": "Inform | Decide | Discuss | Action"
    }
  ],
  "keyDecisionsNeeded": ["Decision 1"]
}`;
  return await askGemini(prompt);
}

module.exports = {
  validateProject, suggestFunctions, generateMilestones,
  generateDashboard, generatePersonalTodos, reAnalyzeDashboard, generateMeetingAgenda
};
