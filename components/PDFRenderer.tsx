'use client'
import {Document, Page,pdfjs} from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from './ui/use-toast';
import {useResizeDetector} from 'react-resize-detector'
import { ChevronsDown, ChevronsUp, Divide, Expand, Loader2, RotateCw } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Input } from './ui/input';
import {useForm} from 'react-hook-form'
import { z } from 'zod';
import {zodResolver} from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import SimpleBar from 'simplebar-react';
import PDFFullscreen from './PDFFullscreen';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
interface PDFRendererProps{
    url:string; 
}


const PDFRenderer = ({url}:PDFRendererProps) => {
    const {toast} = useToast()
    const [numPage,setNumPages] =useState<number>(0)
    const [currentPage,setCurrentPage] = useState<number>(1)
    const [scale,setScale] = useState<number>(1)
    const [rotate,setRotate] = useState<number>(0)
    const {width,ref} = useResizeDetector()
    const [renderedScale,setRenderedScale] = useState<number | null>(null)
    const isloading = renderedScale !== scale
    const coustomVaildator = z.object({
        page:z.string().refine((nums)=>Number(nums)>0 && Number(nums)<=numPage),
    })
    type TCustomeValidator = z.infer<typeof coustomVaildator>
    const {register,handleSubmit,formState:{errors},setValue} = useForm<TCustomeValidator>({
        defaultValues:{
            page:'1'
        },
        resolver:zodResolver(coustomVaildator)
    })
    const handlesubmit=({page,}:TCustomeValidator)=>{
        setValue('page',String(page))
        setCurrentPage(Number(page)) 
    }
    return ( 
            <div className="w-full rounded-md bg-white shadow flex flex-col items-center"> 
                <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <Button disabled={currentPage<=1} onClick={()=>{
                                setCurrentPage((prev)=> (prev-1>1 ? prev-1 : 1)) 
                                setValue('page',String(currentPage-1))
                            }} 
                            variant='ghost' 
                            aria-label='Previous page' 
                            className='ml-2'>
                            <ChevronsDown className='h-4 w-4'/>
                        </Button>
                        <div className='flex items-center gap-1.5  border-gray-500'>
                            <Input 
                            {...register('page')} 
                            className={cn('w-12 h-8',errors.page && 'focus-visible:ring-red-500')}
                            onKeyDown={(e)=>{
                                if (e.key === 'Enter'){
                                    handleSubmit(handlesubmit)();
                                }

                            }}
                            />
                            <p className='text-zinc-700 text-sm space-x-1'>
                                <span>/</span>
                                <span>{numPage ?? 'x'}</span>
                            </p>
                        </div>
                        <Button 
                            disabled={currentPage===undefined || currentPage === numPage} 
                            onClick={()=>{
                                setCurrentPage((prev)=>prev+1 > numPage! ? numPage! : prev+1) 
                                setValue('page',String(currentPage+1))
                            }} 
                            variant='ghost' 
                            aria-label='Next page' 
                            className='ml-2'>
                            <ChevronsUp className='h-4 w-4'/>
                        </Button>
                    </div>
                    <div className='space-x-2'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-label='Zoom' variant='ghost' className='gap-1.5'>
                                    <Expand className='w-4 h-4'/>
                                    {scale*100}%<ChevronsDown className='h-4 w-4 opacity-50'/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={()=>setScale(1)}>
                                    100%
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={()=>setScale(1.5)}>
                                    150%
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={()=>setScale(2)}>
                                    200%
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={()=>setScale(2.5)}>
                                    250%
                                </DropdownMenuItem>    
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button aria-label='Rotate' variant='ghost' onClick={()=>setRotate((prev)=>prev+90)} className='gap-1.5'>
                            <RotateCw className='w-4 h-4'/>
                        </Button>
                        <PDFFullscreen fileurl={url}/>

                    </div>
                </div>
                <div className="flex-1 w-full max-h-screen ">
                    <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)]'>
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
                            {isloading && renderedScale ? 
                                <Page 
                                    width={width ? width : 1}  
                                    pageNumber={currentPage} 
                                    scale={scale} 
                                    rotate={rotate}
                                    key={'@'+ renderedScale} 
                                /> 
                                : null}
                            <Page 
                                className={cn(isloading ? 'hidden' : '')} 
                                width={width ? width : 1} 
                                pageNumber={currentPage} 
                                scale={scale} 
                                rotate={rotate} 
                                key={'@'+ scale}
                                loading={
                                    <div className='flex justify-center'>
                                        <Loader2 className='my-24 h-6 w-6 animate-spin'/>
                                    </div>
                                }
                                onRenderSuccess={()=> setRenderedScale(scale)}
                            /> 
                        </Document>
                    </div>
                    </SimpleBar>
                </div>
            </div>
    )
}
 
export default PDFRenderer;