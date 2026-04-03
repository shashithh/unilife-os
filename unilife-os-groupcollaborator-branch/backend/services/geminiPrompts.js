// ============================================================
//  geminiPrompts.js  —  AI Prompt Engine
//  Stack : MERN + @google/generative-ai  (Gemini Pro)
//  Usage : import { validateProject, suggestFunctions, ... }
// ============================================================
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ─── helper: call Gemini and parse JSON safely ───────────────
async function askGemini(prompt) {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // strip markdown code fences if Gemini wraps in ```json ... ```
    const clean = text.replace(/```json|```/g, "").trim();
    try {
        return JSON.parse(clean);
    } catch {
        return { error: "AI response could not be parsed", raw: text };
    }
}

// ════════════════════════════════════════════════════════════
//  1.  INPUT VALIDATION
//      Call this the moment the user submits Step 1.
//      Returns: { valid, reason, detectedType }
// ════════════════════════════════════════════════════════════
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

// ════════════════════════════════════════════════════════════
//  2.  FUNCTION / FEATURE SUGGESTIONS
//      Call after validation passes.
//      Returns: { functions: [ { id, name, description, suggestedRole } ] }
// ════════════════════════════════════════════════════════════
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
1. Suggest between 4 and 8 functions — no more, no less.
2. Each function must be SPECIFIC to this exact project. Do NOT suggest generic things like "Communication" or "Management".
3. Each function should be completable by one or two people.
4. The suggestedRole must be one of the provided member NAMES exactly as given.
5. The assignedUserId must be the ID of the member you assign (from the list above).
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

// ════════════════════════════════════════════════════════════
//  3.  MILESTONE GENERATION
//      Call after roles are assigned in Step 2.1.
//      Returns: { milestones: [ { id, title, date, description, linkedFunctions[] } ] }
// ════════════════════════════════════════════════════════════
async function generateMilestones({ name, description, detectedType, deadline, assignedFunctions }) {
    const fnList = assignedFunctions
        .map(f => `- ${f.name} (assigned to: ${f.assignedTo}, userId: ${f.assignedUserId || 'N/A'})`)
        .join("\n");
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
2. Space them realistically — don't bunch them all at the end.
3. The LAST milestone must be on or before the final deadline.
4. Each milestone should mark a meaningful checkpoint, not just "start task X".
5. Link each milestone to 1–3 of the assigned function names.
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

// ════════════════════════════════════════════════════════════
//  4.  DASHBOARD DATA GENERATION
//      Call after milestones are confirmed.
//      Returns full dashboard seed data for the 4 widgets.
// ════════════════════════════════════════════════════════════
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

Generate the INITIAL seed data for 4 dashboard widgets. Since the project just started, set all progress to 0% but make the structure realistic and specific to this project.

Respond ONLY with this JSON — no extra text:
{
  "workloadHeatmap": {
    "description": "One line explaining what the heatmap is showing for this project.",
    "members": [
      {
        "name": "Member name",
        "assignedFunctions": ["fn_1"],
        "estimatedWeeklyHours": 0,
        "workloadLevel": "Low | Medium | High"
      }
    ]
  },
  "projectFlow": {
    "stages": [
      {
        "stage": "Stage name",
        "status": "Not Started | In Progress | Completed",
        "linkedMilestone": "ms_1",
        "order": 1
      }
    ]
  },
  "roadmapMilestones": {
    "totalMilestones": 0,
    "completedMilestones": 0,
    "upcomingMilestone": {
      "title": "First milestone title",
      "date": "YYYY-MM-DD",
      "daysRemaining": 0
    },
    "overallProgress": 0
  },
  "activityFeed": {
    "latestActivities": [
      {
        "type": "project_created",
        "message": "Project \\"${name}\\" was created and dashboard initialized.",
        "timestamp": "ISO timestamp of now"
      }
    ]
  },
  "aiInsight": "One smart observation about this project's timeline or workload that only AI would notice — be specific and useful, not generic."
}`;
    return await askGemini(prompt);
}

// ════════════════════════════════════════════════════════════
//  5.  PERSONAL TO-DO LIST GENERATION (per member)
//      Call once per member after dashboard is created.
//      Returns: { todos: [ { id, task, priority, estimatedHours, tip } ] }
// ════════════════════════════════════════════════════════════
async function generatePersonalTodos({ projectName, projectDescription, detectedType, deadline, memberName, assignedFunction, milestones }) {
    const relatedMilestones = milestones
        .filter(m => m.linkedFunctions.includes(assignedFunction.id))
        .map(m => `${m.title} due ${m.date}`)
        .join(", ");
    const prompt = `You are a personal task planner AI inside a project management tool.

Project  : "${projectName}"
Type     : "${detectedType}"
Deadline : "${deadline}"

This to-do list is ONLY for: ${memberName}
Their assigned function: "${assignedFunction.name}" — ${assignedFunction.description}
Related milestones they must hit: ${relatedMilestones || "None directly linked"}

Generate a personal to-do list for ${memberName} to complete their function successfully before the deadline.

Rules:
1. Create between 5 and 9 tasks — specific to their function, not generic.
2. Tasks should be ordered logically (what to do first, second, etc.).
3. Each task should be completable in 1–8 hours.
4. Include a short "tip" — a specific piece of advice only an expert in this area would know.
5. Priority: "High" = blocks others or is on the critical path, "Medium" = important, "Low" = nice to have.

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

// ════════════════════════════════════════════════════════════
//  6.  DASHBOARD RE-ANALYSIS (called on every status update)
//      Updates insights and flags risks when members update tasks.
//      Returns: { updatedInsight, risks, suggestion }
// ════════════════════════════════════════════════════════════
async function reAnalyzeDashboard({ projectName, deadline, milestones, memberProgress }) {
    const progressSummary = memberProgress
        .map(m => `${m.name}: ${m.done} done, ${m.inProgress} in progress, ${m.skipped} skipped out of ${m.total} tasks`)
        .join("\n");
    const msSummary = milestones
        .map(m => `${m.title} — due ${m.date} — ${m.isCritical ? "CRITICAL" : "normal"}`)
        .join("\n");
    const prompt = `You are a project health AI monitoring a live project.

Project: "${projectName}"
Deadline: "${deadline}"

Current milestone schedule:
${msSummary}

Current member progress:
${progressSummary}

Analyze the current state and respond ONLY with this JSON — no extra text:
{
  "overallHealthScore": 0 to 100,
  "healthLabel": "On Track | At Risk | Behind | Critical",
  "updatedInsight": "One specific, honest observation about the project's current state.",
  "risks": ["Risk 1 — specific and actionable", "Risk 2 — only include if genuinely present"],
  "suggestion": "The single most important thing the team should do RIGHT NOW to stay on track.",
  "predictedCompletion": "Your predicted actual completion date in YYYY-MM-DD based on current pace"
}`;
    return await askGemini(prompt);
}

// ════════════════════════════════════════════════════════════
//  7.  MEETING AGENDA GENERATOR (bonus feature)
//      Call when creator schedules a meeting.
//      Returns: { agenda: [ { item, duration, owner } ] }
// ════════════════════════════════════════════════════════════
async function generateMeetingAgenda({ projectName, meetingDate, memberProgress, upcomingMilestones }) {
    const progressSummary = memberProgress
        .map(m => `${m.name}: ${m.done}/${m.total} done, ${m.skipped} skipped`)
        .join(", ");
    const msList = upcomingMilestones.map(m => `${m.title} on ${m.date}`).join(", ");
    const prompt = `You are a meeting facilitator AI for a project management tool.

Project: "${projectName}"
Meeting date: "${meetingDate}"
Team progress: ${progressSummary}
Upcoming milestones: ${msList}

Generate a focused meeting agenda. Keep it under 45 minutes total. Only include agenda items that are genuinely needed based on the current project state.

Respond ONLY with this JSON — no extra text:
{
  "meetingTitle": "Short, specific meeting title",
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
  "keyDecisionsNeeded": ["Decision 1", "Decision 2"]
}`;
    return await askGemini(prompt);
}

// ════════════════════════════════════════════════════════════
//  EXPORTS
// ════════════════════════════════════════════════════════════
module.exports = {
    validateProject,
    suggestFunctions,
    generateMilestones,
    generateDashboard,
    generatePersonalTodos,
    reAnalyzeDashboard,
    generateMeetingAgenda,
};
