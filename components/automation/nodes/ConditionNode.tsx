import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { GitBranch } from "lucide-react"

export default memo(function ConditionNode({ data }: NodeProps) {
    return (
        <div className="px-4 py-3 rounded-lg border-2 border-yellow-500 bg-card shadow-lg min-w-[200px]">
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 !bg-yellow-500"
            />

            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <GitBranch className="h-4 w-4 text-yellow-500" />
                </div>
                <div>
                    <div className="text-xs text-muted-foreground">Condição</div>
                    <div className="font-semibold text-sm">{data.label || "Nova Condição"}</div>
                </div>
            </div>

            {data.condition && (
                <div className="text-xs text-muted-foreground mt-2">
                    {data.condition}
                </div>
            )}

            <div className="flex justify-between mt-2">
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="true"
                    className="w-3 h-3 !bg-green-500 !left-[25%]"
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="false"
                    className="w-3 h-3 !bg-red-500 !left-[75%]"
                />
            </div>
        </div>
    )
})
