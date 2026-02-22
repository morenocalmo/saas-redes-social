import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { Clock } from "lucide-react"

export default memo(function DelayNode({ data }: NodeProps) {
    return (
        <div className="px-4 py-3 rounded-lg border-2 border-purple-500 bg-card shadow-lg min-w-[200px]">
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 !bg-purple-500"
            />

            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                    <div className="text-xs text-muted-foreground">Aguardar</div>
                    <div className="font-semibold text-sm">{data.label || "Novo Delay"}</div>
                </div>
            </div>

            {data.delay && (
                <div className="text-xs text-muted-foreground mt-2">
                    {data.delay}
                </div>
            )}

            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 !bg-purple-500"
            />
        </div>
    )
})
