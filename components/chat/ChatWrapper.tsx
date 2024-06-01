'use client'
import { trpc } from "@/app/_trpc/client";
import ChatInputs from "./ChatInputs";
import Messages from "./Messages";
import { ChevronLeft, FileVideo, Loader2, XCircle } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";

interface ChatWrapperProps {
    fileId : string;
}
const ChatWrapper = ({fileId}:ChatWrapperProps) => {
    const {data,isLoading} =trpc.getFileUploadStatus.useQuery({
        fileId
    },{
        refetchInterval:(data)=>
            data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500
    })
    if(isLoading) return(
        <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
            <div className="flex-1 flex justify-center items-center flex-col mb-28">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin"/>
                    <h3 className="font-semibold text-xl"> Loading...</h3>
                    <p className="text-zinc-500 text-sm">
                        Sit tight we&apos;re preparing your Pdf. 
                    </p>
                </div>
            </div>
        </div>
    )
    if(data?.status === 'PROCESSING') return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl"> Processing...</h3>
            <p className="text-zinc-500 text-sm">
              This won&apos;t take long.
            </p>
          </div>
        </div>
        <ChatInputs isDisabled />
      </div>
    );
    if(data?.status === 'FAILED')return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="w-8 h-8 text-red-500" />
            <h3 className="font-semibold text-xl">Failed to load the File</h3>
            <Link href='/dashboard' className={buttonVariants({
                variant:'secondary',
                className:'mt-4'
            })}>
                <ChevronLeft className="h-3 w-3 mr-1.5"/>
                Back
            </Link>
          </div>
        </div>
        <ChatInputs isDisabled />
      </div>
    );
    return ( 
        <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between">
            <div className="flex-1 flex flex-col justify-between mb-28">
                <Messages/>
            </div>
            <ChatInputs isDisabled />
        </div>
    );
}
 
export default ChatWrapper;