import { Camera, Image, Smile, Mic, Plus } from "lucide-react"

interface MobilePreviewProps {
    triggerKeywords: string[]
    responseMessage: string
    responseLink: string
}

export function MobilePreview({ triggerKeywords, responseMessage, responseLink }: MobilePreviewProps) {
    const triggerText = triggerKeywords.length > 0 && triggerKeywords[0] !== "" ? triggerKeywords[0] : "Exemplo de gatilho"

    return (
        <div className="flex flex-col items-center justify-center p-8 sticky top-10">
            <h3 className="text-sm font-medium text-muted-foreground mb-6 self-start">Visualização</h3>

            {/* Phone Frame */}
            <div className="relative w-[300px] h-[600px] rounded-[40px] border-[8px] border-zinc-900 bg-black overflow-hidden shadow-2xl ring-1 ring-white/10">

                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                    <div className="w-32 h-6 bg-zinc-900 rounded-b-3xl"></div>
                </div>

                {/* Status Bar */}
                <div className="absolute top-0 inset-x-0 h-10 px-6 flex items-center justify-between text-[10px] text-white font-medium z-10">
                    <span className="mt-1">9:41</span>
                    <div className="flex gap-1 mt-1 items-center">
                        <div className="w-3 h-2.5 border-[1px] border-white rounded-[2px] opacity-80 overflow-hidden relative"><div className="absolute left-0 top-0 bottom-0 bg-white w-2" /></div>
                    </div>
                </div>

                {/* Chat Header */}
                <div className="absolute top-0 inset-x-0 pt-10 pb-3 px-4 flex items-center gap-3 border-b border-white/10 bg-black/80 backdrop-blur-md z-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px]">
                        <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                            <div className="w-full h-full bg-zinc-800" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="text-sm font-semibold text-white">Seu Perfil</div>
                        <div className="text-[10px] text-white/50">Instagram</div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="absolute inset-x-0 top-[80px] bottom-[70px] p-4 flex flex-col gap-4 overflow-y-auto">
                    {/* Incoming Message User */}
                    <div className="flex justify-end mt-4">
                        <div className="bg-blue-600 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] shadow-md">
                            {triggerText}
                        </div>
                    </div>

                    {/* Outgoing Message (Automated) */}
                    {(responseMessage || responseLink) && (
                        <div className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex-shrink-0 mt-auto shadow-md"></div>
                            <div className="flex flex-col gap-1 max-w-[80%]">
                                {responseMessage && (
                                    <div className="bg-zinc-800 text-white text-sm rounded-2xl rounded-tl-sm px-4 py-2 shadow-md whitespace-pre-wrap">
                                        {responseMessage}
                                    </div>
                                )}
                                {responseLink && (
                                    <div className="bg-zinc-800 rounded-xl overflow-hidden border border-white/10 shadow-md">
                                        <div className="px-3 py-2 text-sm text-blue-400 font-medium border-b border-white/10 truncate">
                                            {responseLink}
                                        </div>
                                        <div className="p-2 text-center text-sm text-white font-semibold cursor-pointer hover:bg-white/5 transition-colors">
                                            Acessar Link
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Input */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-black">
                    <div className="flex items-center gap-2 bg-zinc-900 rounded-full px-4 py-2.5">
                        <Camera className="w-5 h-5 text-blue-500" />
                        <div className="flex-1 text-sm text-white/40">Mensagem...</div>
                        <Mic className="w-5 h-5 text-white/50" />
                        <Image className="w-5 h-5 text-white/50" />
                        <Plus className="w-5 h-5 text-white/50" />
                    </div>
                    <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mt-4 mb-2"></div>
                </div>
            </div>

            <div className="mt-6">
                <span className="bg-card border border-white/10 text-muted-foreground text-xs px-4 py-1.5 rounded-full font-medium">
                    DM
                </span>
            </div>
        </div>
    )
}
