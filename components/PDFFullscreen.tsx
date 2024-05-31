import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Fullscreen, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { toast, useToast } from './ui/use-toast';
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

interface PDFRendererProps{
    fileurl:string; 
}

const PDFFullscreen = ({fileurl}:PDFRendererProps) => {
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const [numPage,setNumPages] =useState<number>(0)
    const [currentPage,setCurrentPage] = useState<number>(1)
    const {toast} = useToast();
    const {width,ref} = useResizeDetector();
    return ( 
        <Dialog open={isOpen} onOpenChange={(v)=>{
            if(!v){
                setIsOpen(v);
            }
        }}>
            <DialogTrigger asChild>
                <Button  className='gap-1.5' aria-label="FullScreen" variant='ghost' onClick={()=>setIsOpen(true)}>
                    <Fullscreen className='w-4 h-4'/>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl w-full">
                <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)] mt-6'>
                <div ref={ref}>
                <Document loading={
                            <div className='flex justify-center'>
                                <Loader2 className='my-24 h-6 w-6 animate-spin'/>
                            </div>
                        }
                        onError={()=>{
                            toast({
                                title:'Error Loading PDF',
                                description:'Please try again later',
                                variant:'destructive',
                            })
                        }}
                        file={fileurl}  
                        className='max-h-full'
                        onLoadSuccess={({numPages})=>setNumPages(numPages)}
                        >
                        {new Array(numPage).fill(0).map((_,i)=>(
                            <Page key={i} width={width ? width : 1} pageNumber={i+1}/>
                        ))}
                        </Document>
                        </div>
                </SimpleBar>
            </DialogContent>
        </Dialog>
    );
}
 
export default PDFFullscreen;