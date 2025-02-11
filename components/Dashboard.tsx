'use client'
import { trpc } from "@/app/_trpc/client";
import UploadButton from "./uploadButton";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Skeleton from 'react-loading-skeleton'
import Link from "next/link";
import {format} from 'date-fns'
import { Button } from "./ui/button";
import { useState } from "react";
const Dashboard = ()=>{
    const [currentFile,setCurrentFile] = useState<String|null>()
    const utlis = trpc.useContext()
    const {data:files,isLoading} =trpc.getUserFiles.useQuery()
    const {mutate:deleteFile} = trpc.deleteFile.useMutation({
        onSuccess:()=>{
            utlis.getUserFiles.invalidate()
        },
        onMutate({id}){
          setCurrentFile(id)
        },
        onSettled(){
          setCurrentFile(null)
        }
    })
    return (
      <main className="mx-auto max-w-7xl md:p-10">
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
          <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>
          <UploadButton />
        </div>
        {files && files?.length !== 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
            {files
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              ).map((file)=>(
                <li key={file.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg">
                    <Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
                        <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 "/>
                                <div className="flex-1 truncate">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="font-medium text-zinc-900 text-lg">
                                            {file.name}
                                        </h3>
                                    </div>
                                </div>
                        </div>
                    </Link>
                    <div className="px-4 mt-4 grid grid-cols-3 place-items-center py-2 gap-5 test-xs text-zinc-500">
                        <div className="flex items-center gap-2">
                                <Plus className="w-4 h-4"/>
                                {format(new Date(file.created_at),'dd MMM yyyy')}
                        </div>
                        <div>
                        <MessageSquare className="h-4 w-4"/>
                        Mocked
                        </div>
                        <Button onClick={()=>deleteFile({id:file.id})} className="w-full" size='sm' variant='destructive'>
                            {currentFile === file.id ? (
                              <Loader2 className="h-4 w-4 animate-spin"/>
                            ) : (<Trash className="h-4 w-4"/>)}
                        </Button>
                    </div>

                </li>
              ))}
          </ul>
        ) : isLoading ? (
          <Skeleton className="my-2" height={100} count={3} />
        ) : (
          <div className="mt-16 flex flex-col items-center gap-2">
            <Ghost className="h-8 w-8 text-zinc-800" />
            <h3 className="font-semibold text-xl">
              It feels quite empty here.
            </h3>
            <p>Let&apos;s Upload your First PDF!!</p>
          </div>
        )}
      </main>
    );
}
export default Dashboard;