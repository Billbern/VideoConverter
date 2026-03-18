import { useSelector, useDispatch } from "react-redux";
import { selectMedia, selectFormat } from './action';


function Controller(props) {

    const media = useSelector(state => state.options.mediatype);
    const dispatch = useDispatch();

    function setMedia(content, selectMedia, dispatch){
        return dispatch(selectMedia(content));
    }

    function setFormat(content, selectFormat, dispatch){
        return dispatch(selectFormat(content));
    }
    
    return (
        <div className="med-controller">
            
            <select name="mediatype" onChange={e=> setMedia(e.target.value, selectMedia, dispatch)}>
                <option value="">---</option>
                {
                    ["audio", "video"].map((item, key) => <option key={key} value={item}>{item}</option>)
                }
                
            </select>
            <label htmlFor="mediatype">output</label>
            
            <select name="convertto" id="convertTo" onChange={e=> setFormat(e.target.value, selectFormat, dispatch)}>
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