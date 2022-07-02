

export default function Accordion(props){
    return(
        <div className="accordion m-2 " id="accordionPanelsStayOpenExample">
            <div className="accordion-item bg-dark bg-opacity-50">
                <h2 className="accordion-header collapsed" id="panelsStayOpen-headingOne">
                    <button className="accordion-button collapsed bg-dark text-white bg-opacity-50" type="button" data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseOne">
                        <h3>Плейлисты</h3>
                    </button>
                </h2>
                <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse"
                     aria-labelledby="panelsStayOpen-headingOne">
                    <div className="accordion-body">
                        <div className="row row-cols-1 row-cols-md-6 g-4">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}