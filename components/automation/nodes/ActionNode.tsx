import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { Send } from "lucide-react"

export default memo(function ActionNode({ data }: NodeProps) {
    return (
        <div className="px-4 py-3 rounded-lg border-2 border-blue-500 bg-card shadow-lg min-w-[200px]">
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 !bg-blue-500"
            />

            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Send className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                    <div className="text-xs text-muted-foreground">Ação</div>
                    <div className="font-semibold text-sm">{data.label || "Nova Ação"}</div>
                </div>
            </div>

            {data.action && (
                <div className="text-xs text-muted-foreground mt-2">
                    {data.action}
                </div>
            )}

            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 !bg-blue-500"
            />
        </div>
    )
})
