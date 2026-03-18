import "./App.css";
import axios from 'axios';
import { useEffect } from 'react'; 
import { useDispatch, useSelector } from "react-redux";
import {Header, Controller, Uploader, updateLink} from "./components";


const host = 'https://mongoconvertbackend.herokuapp.com';

function sendData(host, options, data, updateLink, dispatch) {

    data.forEach(dataItem => {
        if (dataItem.file && !dataItem.link) {
            const formData = new FormData();
            formData.append('file', dataItem.file);
            axios({ method: "Post", url: `${host}/mongconverter/api/v1/${dataItem.id}?media=${options.mediatype}&format=${options.formattype}`, 
                    data: formData, headers: { "Content-Type": "application/json", }, 
                })
                .then(res => {
                    dispatch(updateLink({id: res.data.id, link: `${host}${res.data.link}`}));
                })
                .catch(err => {
                    console.log(err);
                });
        }
    })
}


function App() {

  const data = useSelector(state => state.data);
  const options = useSelector(state => state.options );
  const dispatch = useDispatch();

  useEffect(() => {
    if(data.length > 0 && options.mediatype && options.formattype){
      sendData(host, options, data, updateLink, dispatch);
    }
  }, [data, options])

  return (
    <div className="App">
      <Header />
      <main>
        <div className="App_right">
          <Controller />
          <Uploader />
        </div>
      </main>
    </div>
  );
}

export default App;
