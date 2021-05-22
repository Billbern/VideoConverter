const initialState = { 
    options: { mediatype: "", formattype: "" }, 
    data: [] 
}


function nextDataId(data) {
    const dataId = data.reduce((dataId, data) => Math.max(data.id, dataId), -1)
    return dataId + 1111
}


export default function mongReducer(state = initialState, action) {
    switch (action.type) {
        case "mediaSelect":
            return {
                ...state, 
                options: {...state.options, mediatype : action.payload }
            }
        case "formatSelect":
            return {
                ...state, 
                options: {...state.options, formattype : action.payload }
            }
        case "fileUpload":
            return {
                ...state,
                data : [
                    ...state.data,
                    {
                        id: nextDataId(state.data),
                        name: action.payload.name,
                        file: action.payload.file,
                        type: action.payload.type,
                        display: action.payload.display
                    }
                ]
            }
        case "transcodeDone":
            return {
                ...state,
                data : state.data.map(dataItem => {
                    if(String(dataItem.id) === action.payload.id){
                        return {
                            ...dataItem,
                            link: action.payload.link
                        }
                    }
                    return dataItem;
                })
            }
        default:
            return state;
    }
}