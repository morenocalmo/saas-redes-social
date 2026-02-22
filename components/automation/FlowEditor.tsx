"use client"

import { useCallback } from "react"
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    BackgroundVariant,
    MiniMap,
} from "reactflow"
import "reactflow/dist/style.css"

import TriggerNode from "./nodes/TriggerNode"
import ActionNode from "./nodes/ActionNode"
import ConditionNode from "./nodes/ConditionNode"
import DelayNode from "./nodes/DelayNode"

const nodeTypes = {
    trigger: TriggerNode,
    action: ActionNode,
    condition: ConditionNode,
    delay: DelayNode,
}

interface FlowEditorProps {
    initialNodes?: Node[]
    initialEdges?: Edge[]
    onSave?: (nodes: Node[], edges: Edge[]) => void
}

export default function FlowEditor({ initialNodes = [], initialEdges = [], onSave }: FlowEditorProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    )

    const handleSave = () => {
        if (onSave) {
            onSave(nodes, edges)
        }
    }

    return (
        <div className="w-full h-[calc(100vh-12rem)] rounded-lg border border-white/10 overflow-hidden">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-background"
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={16}
                    size={1}
                    className="opacity-20"
                />
                <Controls className="bg-card border border-white/10 rounded-lg" />
                <MiniMap
                    className="bg-card border border-white/10 rounded-lg"
                    maskColor="rgba(0, 0, 0, 0.6)"
                />
            </ReactFlow>
        </div>
    )
}
