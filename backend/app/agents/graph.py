from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.postgres import PostgresSaver
from app.services.database import DATABASE_URL

from app.agents.state import LeadState
from app.agents.nodes import (
    analyze_lead,
    save_analysis,
    high_priority,
    medium_priority,
    low_priority,
    generate_email,
    human_approval,
    send_email_node
)


def route_by_score(state: LeadState):
    score = state["analysis"].score

    if score >= 75:
        return "high"
    elif score >= 40:
        return "medium"

    return "low"


def route_after_approval(state: LeadState):
    if state.get("email_status") == "approved":
        return "send_email"

    return "end"


builder = StateGraph(LeadState)

builder.add_node("analyze_lead", analyze_lead)
builder.add_node("save_analysis", save_analysis)
builder.add_node("high_priority", high_priority)
builder.add_node("medium_priority", medium_priority)
builder.add_node("low_priority", low_priority)
builder.add_node("generate_email", generate_email)
builder.add_node("human_approval", human_approval)
builder.add_node("send_email", send_email_node)

builder.add_edge(START, "analyze_lead")
builder.add_edge("analyze_lead", "save_analysis")

builder.add_conditional_edges(
    "save_analysis",
    route_by_score,
    {
        "high": "high_priority",
        "medium": "medium_priority",
        "low": "low_priority"
    }
)

builder.add_edge("high_priority", "generate_email")
builder.add_edge("medium_priority", "generate_email")
builder.add_edge("low_priority", "generate_email")

builder.add_edge("generate_email", "human_approval")

builder.add_conditional_edges(
    "human_approval",
    route_after_approval,
    {
        "send_email": "send_email",
        "end": END
    }
)

builder.add_edge("send_email", END)


checkpointer_context = PostgresSaver.from_conn_string(DATABASE_URL)
checkpointer = checkpointer_context.__enter__()

checkpointer.setup()

lead_graph = builder.compile(checkpointer=checkpointer)
