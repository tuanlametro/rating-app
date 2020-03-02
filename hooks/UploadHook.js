import { fetchPost } from "./APIHooks";
import { AsyncStorage } from "react-native";

const uploadHook = () => {
    const handleUpload = async (file, navigation) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const filename = file.Poster.split('/').pop(); 
            const match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            if (type === 'image/jpg') type = 'image/jpeg';         
            const formData = new FormData();
            const details = {
                ratings: file.Ratings,
                description: file.Plot,
                genres: file.Genre,
                cast: file.Actors,
                duration: file.Runtime
            };
            
            formData.append('title', file.Title);
            formData.append('description', JSON.stringify(details));
            formData.append('file', {uri: file.Poster, name: filename, type})
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/form-data',
                    'x-access-token': token,
                },
                body: formData,
            };
            
            const response = await fetch('http://media.mw.metropolia.fi/wbma/media', options);
            const toJSON = await response.json();
            const data = {
                file_id: toJSON.file_id,
                tag: 'rating-app',
            };

            const tagOptions = {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };

            const tagResponse = await fetch('http://media.mw.metropolia.fi/wbma/tags', tagOptions);
            const tagToJSON = await tagResponse.json();
        } catch (error) {
            console.log('handleUpload error: ', error.message);
        }
    };

    return {
        handleUpload,
    }
};

export default uploadHook;