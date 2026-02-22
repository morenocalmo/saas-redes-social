import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { Zap } from "lucide-react"

export default memo(function TriggerNode({ data }: NodeProps) {
    return (
        <div className="px-4 py-3 rounded-lg border-2 border-primary bg-card shadow-lg min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <div className="text-xs text-muted-foreground">Gatilho</div>
                    <div className="font-semibold text-sm">{data.label || "Novo Gatilho"}</div>
                </div>
            </div>

            {data.trigger && (
                <div className="text-xs text-muted-foreground mt-2">
                    {data.trigger}
                </div>
            )}

            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 !bg-primary"
            />
        </div>
    )
})
