const selectMedia = (media) => {
    return {
        type: 'mediaSelect',
        payload: media
    }
}

const selectFormat = (format) => {
    return {
        type: 'formatSelect',
        payload: format
    }
}

const uploadFile = (details) => {
    return {
        type: 'fileUpload',
        payload: details
    }
}

const updateLink = (data) =>{
    return {
        type: 'transcodeDone',
        payload: data
    }
}


export {selectMedia, selectFormat, uploadFile, updateLink};