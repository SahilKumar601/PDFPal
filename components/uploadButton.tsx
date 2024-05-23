import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Dropzone from 'react-dropzone';
import { CloudUpload, File } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "./ui/use-toast";

const UploadZone = ()=>{
    const [isUploading,setIsUploading] = useState<boolean>(true);
    const [UploadProgress,setUploadProgress] = useState<number>(0);
    const {startUpload} = useUploadThing('PdfUploader')
    const {toast} = useToast()

    const SimulateProgress=()=>{
        setUploadProgress(0);
        const interval = setInterval(()=>{
            setUploadProgress((prev)=>{
                if(prev>=95){
                    clearInterval(interval)
                    return prev
                }
                return prev+5;
            })
        },500)
        return interval
    }
    return (
        <div>
            <Dropzone multiple={false} onDrop={async (acceptFile)=>{
                setIsUploading(true)
                const progress = SimulateProgress()
                const res  = await startUpload(acceptFile)
                if(!res){
                    return toast({
                        title: 'Something went wrong',
                        description: 'Please try again later',
                        variant:'destructive'
                    })
                }
                const [fileresponse] = res
                const key = fileresponse?.key
                if(!key){
                    return toast({
                        title: 'Something went wrong',
                        description: 'Please try again later',
                        variant:'destructive'
                    })
                }
                clearInterval(progress)
                setUploadProgress(100)
            }}>
                {({getRootProps,getInputProps,acceptedFiles})=>(
                    <div {...getRootProps()} className="border h-64 m-4 border-dashed border-gray-300 rounded-lg">
                        <div className="flex items-center justify-center h-full w-full ">
                            <label htmlFor="DropZone-file" className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <CloudUpload className="h-6 w-6 text-zinc-500 mb-2"/>
                                    <p className="mb-2 text-sm text-zinc-700 ">
                                        <span className="font-semibold">Click To Upload</span> or Drap and Drop
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        PDF (up To 4MB)
                                    </p>
                                </div>
                                {acceptedFiles && acceptedFiles[0] ? (
                                    <div className="max-w-xs bg-white flex items-center place-items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                                        <div className="px-3 py-3 h-full grid place-items-center">
                                            <File className="h-6 w-6 text-blue-500"/>
                                        </div>
                                        <div className="px-3 py-2 h-full text-sm truncate">
                                            {acceptedFiles[0].name}
                                        </div>
                                    </div>
                                ) : null}
                                {isUploading ? (
                                    <div className="w-full mt-4 max-w-xs mx-auto">
                                        <Progress value={UploadProgress} className="h-1 w-full bg-zinc-200"/>
                                    </div>
                                ) :null}
                            </label>
                        </div>
                    </div>
                )}
            </Dropzone>
        </div>
    )
}
const UploadButton=()=>{
    const [isOpen,setIsOpen] = useState<boolean>(false);

    return(
        <>
            <Dialog open={isOpen} onOpenChange={(v)=>{
                if(!v){
                    setIsOpen(v)
                }
            }}>
                <DialogTrigger onClick={()=> setIsOpen(true)} asChild>
                    <Button>Upload PDF</Button>
                </DialogTrigger>
                <DialogContent>
                    <UploadZone></UploadZone>
                </DialogContent>
            </Dialog>
        </>
    )
}
export default UploadButton;