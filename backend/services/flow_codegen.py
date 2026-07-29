import json

def generate_langgraph_code(nodes: list, edges: list, flow_name: str = "MyGraph") -> str:
    code = f"\"\"\"\nGenerated LangGraph code for {flow_name}\n\"\"\"\n\n"
    code += "from typing import TypedDict, Annotated, Sequence\n"
    code += "import operator\n"
    code += "from langchain_core.messages import BaseMessage\n"
    code += "from langgraph.graph import StateGraph, END\n\n"
    
    code += "class GraphState(TypedDict):\n"
    code += "    messages: Annotated[Sequence[BaseMessage], operator.add]\n"
    code += "    # add other state fields here\n\n"
    
    # Generate nodes
    node_names = []
    for node in nodes:
        node_id = node.get("id", "unknown").replace("-", "_")
        node_names.append(node_id)
        code += f"def node_{node_id}(state: GraphState):\n"
        code += f"    print('Running node: {node_id}')\n"
        code += f"    return {{'messages': []}}\n\n"
        
    code += f"def build_graph():\n"
    code += f"    workflow = StateGraph(GraphState)\n\n"
    
    for name in node_names:
        code += f"    workflow.add_node('{name}', node_{name})\n"
        
    code += "\n"
    for edge in edges:
        source = edge.get("source", "").replace("-", "_")
        target = edge.get("target", "").replace("-", "_")
        if target == "end":
            target = "END"
        else:
            target = f"'{target}'"
        code += f"    workflow.add_edge('{source}', {target})\n"
        
    code += "\n    # Set entry point\n"
    if node_names:
        code += f"    workflow.set_entry_point('{node_names[0]}')\n"
        
    code += "\n    return workflow.compile()\n\n"
    code += "if __name__ == '__main__':\n"
    code += "    app = build_graph()\n"
    code += "    # app.invoke({'messages': []})\n"
    
    return code
