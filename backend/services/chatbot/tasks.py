from crewai import Task
from services.chatbot.agents import triage_agent, doctor_agent, report_agent

triage_task = Task(
    description="Analyze patient input: {input}. Identify symptoms and urgency level.",
    agent=triage_agent,
    expected_output="Symptoms list + urgency (low/medium/high)"
)

analyze_task = Task(
    description="Analyze the given patient's medical report: {report}. Identify symptoms and urgency level. If no report is provided just return the control flow to doctor_agent",
    agent=report_agent,
    expected_output="Symptoms list + urgency (low/medium/high)"
)

doctor_task = Task(
    description="Based on triage result, provide safe advice. Avoid diagnosis.",
    agent=doctor_agent,
    context=[triage_task, analyze_task],
    expected_output="Helpful guidance + next steps"
)