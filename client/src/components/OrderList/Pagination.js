import React, {useState} from 'react';
import './Pagination.css'

const Pagination=({data, RenderComp, dataLimit})=>{

    const [totalPages] =  useState(Math.ceil(data.length/dataLimit));
    const [currentPage, setCurrentPage]= useState(1);

    function goToNextPage(){
        setCurrentPage((page)=>page + 1);
    }

    function goToPrevPage(){    
        setCurrentPage((page)=>page-1);
    }

    function changePage(event){
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
    }

        // Data to display in specific page
    const getPaginationData=()=>{
        const startIndex = (currentPage - 1) * dataLimit;
        const endIndex = Math.min(startIndex + dataLimit, data.length);

        return data.slice(startIndex, endIndex);
    }

        // Algorithm to show 5 page numbers
    const getPager=()=>{

        var startPage, endPage;

        if(totalPages<=5){
            startPage = 1;
            endPage = totalPages;
        }else{
            if(currentPage <=3){
                startPage=1;
                endPage =5;
            }
            else if(currentPage + 2 >= totalPages){
                startPage = totalPages-4;
                endPage = totalPages;
            }
            else{
                startPage = currentPage - 2
                endPage = currentPage +2
            }
        }

        var pager = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);
        return pager
    }

    function goToLastPage(){
        setCurrentPage(totalPages)
    }
    function goToFirstPage(){
        setCurrentPage(1)
    }
    
    return(
        <div>
            <div className="dataContainer">
                <RenderComp data={getPaginationData()}/>
            </div>

            <div className="pagination">
                 <button
                    onClick={goToFirstPage}
                    className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
                >
                  First
                </button>
                
                <button
                    onClick={goToPrevPage}
                    className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
                >
                    Prev
                </button>

                {/* show page numbers */}
                {getPager().map((item, index) => (
                    <button
                        key={index}
                        onClick={changePage}
                        className={`paginationItem ${currentPage === item ? 'active' : null}`}
                    >
                    <span>{item}</span>
                    </button>
                ))}

                <button
                    onClick={goToNextPage}
                    className={`next ${currentPage === totalPages ? 'disabled' : ''}`}
                >
                    Next
                </button>
                <button
                    onClick={goToLastPage}
                    className={`next ${currentPage === totalPages ? 'disabled' : ''}`}
                >
                    Last
                </button>
            </div>
        </div>
    )
}

export default Pagination
