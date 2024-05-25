'use client'
import {Document, Page,pdfjs} from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from './ui/use-toast';
import {useResizeDetector} from 'react-resize-detector'
import { ChevronsDown, ChevronsUp, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
interface PDFRendererProps{
    url:string;
}
const PDFRenderer = ({url}:PDFRendererProps) => {
    const {toast} = useToast()
    const [numPage,setNumPages] =useState<number>(0)
    const [currentPage,setCurrentPage] = useState<number>(1)
    const {width,ref} = useResizeDetector()
    return ( 
            <div className="w-full rounded-md bg-white shadow flex flex-col items-center"> 
                <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <Button disabled={currentPage<=1} onClick={()=>setCurrentPage((prev)=> (prev-1>1 ? prev-1 : 1))} variant='ghost' aria-label='Previous page' className='ml-2'>
                            <ChevronsDown className='h-4 w-4'/>
                        </Button>
                        <div className='flex items-center gap-1.5  border-gray-500'>
                            <input className='w-12 h-8'/>
                            <p className='text-zinc-700 text-sm space-x-1'>
                                <span>/</span>
                                <span>{numPage ?? 'x'}</span>
                            </p>
                        </div>
                        <Button disabled={currentPage===undefined || currentPage === numPage} onClick={()=>setCurrentPage((prev)=>prev+1 > numPage! ? numPage! : prev+1)} variant='ghost' aria-label='Next page' className='ml-2'>
                            <ChevronsUp className='h-4 w-4'/>
                        </Button>
                    </div>
                </div>
                <div className="flex-1 w-full max-h-screen ">
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
                        file={url}  
                        className='max-h-full'
                        onLoadSuccess={({numPages})=>setNumPages(numPages)}
                        >
                            <Page width={width ? width : 1} pageNumber={currentPage} />
                        </Document>
                    </div>
                </div>
            </div>
    )
}
 
export default PDFRenderer;