import React from 'react';

function Uploader() {

    const [data, setData] = React.useState([]);

    function dropHandler(e){
        e.preventDefault()

        const items = e.dataTransfer.items;

        if (items){
            let newdata = [...data];
            [...items].forEach(item =>{
                if (item.type.split('/')[0] === 'video' || item.type.split('/')[0] === 'audio'){
                    let file = item.getAsFile();
                    const displayHolder = URL.createObjectURL(file);
                    newdata.push({'src': displayHolder, 'type': file.type, 'title': file.name});
                }
            });
            setData(newdata)
        }else{
            console.log(items);
        }
    }

    function dragOverHandler(e){
        e.preventDefault()
    }

    function onSelect(e){
        e.preventDefault();
        const inputFiles = [...e.target.files];
        let newdata = [];
        
        inputFiles.forEach(item =>{
            if (item.type.split('/')[0] === 'video' || item.type.split('/')[0] === 'audio'){
                const displayHolder = URL.createObjectURL(item);
                newdata.push({'src': displayHolder, 'type': item.type, 'title': item.name});
            }
        });
        setData(newdata)
    }
    
    return (
        <div className="load_par"> 
            { data.length > 0 ? 
                    <div onDrop={dropHandler} onDragOver={dragOverHandler} className="disp_inner">
                        <div className="disp_owner">
                        {data.map((item, key) =>
                                <div key={key} title={item.title} className="media_item">
                                    <video >
                                        <source src={item.src} type={item.type}/>
                                    </video>
                                </div>
                            )
                        }
                        </div>
                    </div> 
                    :
                    <div onDrop={dropHandler} onDragOver={dragOverHandler} className="load_inner">
                        <form method="post" action="" encType="multipart/form-data" className="load_content">
                            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M512 288.43c0 64.162-52.198 116.36-116.36 116.36H274.33V269.85l32.626 32.626c3.364 3.364 7.777 5.049 12.187 5.049s8.822-1.682 12.187-5.049c6.731-6.731 6.731-17.645 0-24.373l-63.137-63.137c-6.731-6.731-17.645-6.731-24.373 0l-63.137 63.137c-6.731 6.731-6.731 17.645 0 24.373 3.364 3.364 7.777 5.049 12.187 5.049s8.822-1.682 12.187-5.049l34.804-34.804v137.12h-150.4c-49.326 0-89.452-40.129-89.452-89.452 0-46.867 36.231-85.433 82.156-89.156 6.235-30.624 22.004-58.585 45.357-79.964 27.478-25.157 63.139-39.01 100.42-39.01 52.407 0 100.74 27.786 127.45 72.042a116.6 116.6 0 0140.26-7.184c64.164 0 116.36 52.198 116.36 116.36z"/></svg>
                            <h5>Drag 'n' Drop your media files to here</h5>
                            <p><small>or</small></p>
                            <div className="load_choice">
                                <label htmlFor="attachee">Choose a file</label>
                                <input type="file" name="attachee" id="fileOpen" onChange={onSelect} accept="audio/*,video/*" multiple />
                            </div>
                        </form>
                    </div>
            }  
        </div>
    );
}


export default Uploader;