import { useState } from 'react';
import axios from 'axios';

function Uploader(props) {

    const [display, setDisplay] = useState([]);

    const host = 'http://127.0.0.1:5000';
    let newDisplay = []

    function sendData(file, newDisplay) {
        if (file && props.input.media && props.input.format) {
            const formData = new FormData();
            formData.append('file', file);
            axios({ method: "Post", url: `${host}/mongconverter/api/v1/${props.input.media}?format=${props.input.format}`, data: formData, headers: { "Content-Type": "application/json", }, })
                .then(res => {
                    const newresponse = res.data.response;
                    newDisplay.forEach(item => {
                        let newdata = [];
                        const comparison = newresponse.split('/')[2].replace(/[^0-9a-z]/gi, '').slice(0, -5).toLowerCase() === item.name.replace(/[^0-9a-z]/gi, '').slice(0, -5).toLowerCase();
                        if (comparison) {
                            console.log(item);
                            const newitem = { ...item, link: `${host}${newresponse}` }
                            newdata.push(newitem);
                        }
                        setDisplay(newdata);
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    function displayFiles(files) {
        console.log(files);
        files.forEach((item) => {
            let newdata = []
            if ((item.type.split("/")[0] === "video") ||
                (item.type.split("/")[0] === "audio")) {
                const displayHolder = URL.createObjectURL(item);
                newdata.push({ src: displayHolder, type: item.type, title: item.name, link: '' });
            }
            setDisplay(newdata);
        });
    }

    function onSelect(e) {
        e.preventDefault();
        let newfile;
        const inputFiles = [];

        [...e.target.files].forEach(item => {
            inputFiles.push(item);
            newDisplay.push(item);
            newfile = item;
        });
        if (inputFiles) {
            displayFiles(inputFiles, []);
        }
        if (props.input) {
            sendData(newfile, newDisplay);
        }
    }


    function dropHandler(e) {
        e.preventDefault();

        let newfile;
        const items = [];

        [...e.dataTransfer.items].forEach(item => {
            items.push(item.getAsFile());
            newDisplay.push(item.getAsFile());
            newfile = item.getAsFile();
        })

        if (items) {
            displayFiles(items, [...display]);

        }

        if (props.input) {
            sendData(newfile, newDisplay);
        }
    }

    function dragOverHandler(e) {
        e.preventDefault();
    }

    return (
        <div className="load_par">
            { display.length > 0 ?
                <div onDrop={dropHandler} onDragOver={dragOverHandler} className="disp_inner">
                    <div className="disp_owner">
                        {display.map((item, key) =>

                            <div key={key} title={item.title} className="media_item">
                                {item.link ?
                                    <div className="inner_item">
                                        <a href={item.link} download>
                                            <svg viewBox="0 0 384.97 384.97" xmlns="http://www.w3.org/2000/svg"><path d="M192.48 0C86.18 0 0 86.173 0 192.48c0 106.3 86.185 192.48 192.48 192.48 106.31 0 192.48-86.185 192.48-192.48C384.96 86.17 298.787 0 192.48 0zm0 360.91c-93.018 0-168.42-75.406-168.42-168.42S99.466 24.07 192.48 24.07 360.9 99.476 360.9 192.49s-75.406 168.42-168.42 168.42z" /><path d="M268.1 209.24l-63.46 62.558V84.208c0-6.641-5.438-12.03-12.151-12.03s-12.151 5.39-12.151 12.03v187.59l-63.46-62.558c-4.74-4.692-12.439-4.692-17.179 0-4.74 4.704-4.74 12.319 0 17.011l84.2 82.997c2.25 2.25 5.414 3.537 8.59 3.537 3.164 0 6.328-1.299 8.59-3.525l84.2-82.997a11.942 11.942 0 000-17.011c-4.739-4.704-12.439-4.704-17.179-.012z" /></svg>
                                        </a>
                                    </div>
                                    :
                                    <div className="inner_item">
                                        <span></span>
                                    </div>
                                }
                                <video >
                                    <source src={item.src} type={item.type} />
                                </video>
                            </div>
                        )
                        }
                    </div>
                </div>
                :
                <div onDrop={dropHandler} onDragOver={dragOverHandler} className="load_inner">
                    <form method="post" action="" encType="multipart/form-data" className="load_content">
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M512 288.43c0 64.162-52.198 116.36-116.36 116.36H274.33V269.85l32.626 32.626c3.364 3.364 7.777 5.049 12.187 5.049s8.822-1.682 12.187-5.049c6.731-6.731 6.731-17.645 0-24.373l-63.137-63.137c-6.731-6.731-17.645-6.731-24.373 0l-63.137 63.137c-6.731 6.731-6.731 17.645 0 24.373 3.364 3.364 7.777 5.049 12.187 5.049s8.822-1.682 12.187-5.049l34.804-34.804v137.12h-150.4c-49.326 0-89.452-40.129-89.452-89.452 0-46.867 36.231-85.433 82.156-89.156 6.235-30.624 22.004-58.585 45.357-79.964 27.478-25.157 63.139-39.01 100.42-39.01 52.407 0 100.74 27.786 127.45 72.042a116.6 116.6 0 0140.26-7.184c64.164 0 116.36 52.198 116.36 116.36z" /></svg>
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