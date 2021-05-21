import { useState } from 'react';

function Controller(props) {
    
    const [media, setMedia] = useState('');
    const [format, setFormat] = useState('');

    function setValue(e){
        let mdata = media;
        let fdata = format;
        if (e.target.name === 'mediatype'){
            setMedia(e.target.value);
            mdata = e.target.value;
        }
        if (e.target.name === 'convertto'){
            setFormat(e.target.value);
            fdata = e.target.value;
        }
        if (mdata && fdata){
            props.setInput({media: mdata, format: fdata});
        }

    }
    
    return (
        <div className="med-controller">
            
            <select name="mediatype" onChange={setValue} defaultValue={media}>
                <option value="">---</option>
                <option value="audio">audio</option>
                <option value="video">video</option>
            </select>
            <label htmlFor="mediatype">output</label>
            
            <select name="convertto" id="convertTo" onChange={setValue} defaultValue={format}>
                <option value="">---</option>
                {
                    media === 'audio' ? 
                    ['mp3', 'ogg', 'aac', 'wav'].map((item, key) => <option key={key} value={item}>{item}</option>) 
                    : media === 'video' ? 
                    ['mp4', 'avi', 'mkv', 'ts'].map((item, key) => <option key={key} value={item}>{item}</option>)
                    : 
                    ['', '', '', ''].map((item, key) => <option key={key} value={item}>{item}</option>)
                }
            </select>
            <label htmlFor="convertto">format</label>
            
        </div>
    );
}




export default Controller;