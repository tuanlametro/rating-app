import React, { useEffect, useState, useContext} from 'react';
import {List, Content, View, Text, Picker, Form, Icon, Spinner} from 'native-base';
import { MediaContext } from '../contexts/MediaContext';
import { getAll } from '../hooks/APIHooks';
import SingleItem from './SingleItem';

const MediaList = (props) => {
    const [media, setMedia] = useContext(MediaContext);
    const [data, loading] = getAll();
    const [genres, setGenres] = useState();
    const [filter, setFilter] = useState('all');
    setMedia(data);

    useEffect(() => {
        const separateGenres = () => {
            //Create temporary array
            const cache = [{
                title: '',
                movies: []
            }];

            //For each object (movie) that comes from the server
            media.forEach(item => {
                const info = JSON.parse(item.description);

                //Separate genres and handle them individually
                info.genres.split(', ').forEach(genre => {
                    //If the genre does not exist in the array, push new genre and the movie under the genre
                    if (!cache.find(name => name.genre === genre)) {
                        cache.push({genre: genre, movies: [{movie: JSON.stringify(item)}]});
                    } else {
                        //If the genre is in the array already find the index and add the movie
                        for (let i = 0; i < cache.length; i++) {
                            if (cache[i].genre === genre) {
                                cache[i].movies.push({movie: JSON.stringify(item)});
                            }
                        }
                    }
                })
            })
            //Remove the first empty object from temporary array and order them aplhabetically
            cache.shift();
            cache.sort();
            setGenres(cache);
            console.log(cache);
        };

        if (media) {
            separateGenres();
        }
    }, [media]);

    return (
        <Content>
            {loading ? <Spinner /> : 
            <Content>
            <Form>
                <Picker
                    mode='dropdown'
                    iosIcon={<Icon name='arrow-down' />}
                    selectedValue='Category'
                    onValueChange={value => setFilter(value)}
                >
                    {genres.map(genre => {
                        return (
                            <Picker.Item label={genre.genre} value={genre.genre} />
                        )
                    })}
                </Picker>
            </Form>
            {genres ? 
            <View>
                {genres.map(genre => {
                    return (
                        <View>
                            <Text style={{fontWeight: 'bold', paddingLeft: 5}}> {genre.genre} </Text>
                            <List 
                                dataArray={genre.movies}
                                keyExtractor={(genre, id) => id.toString()}
                                horizontal={true}
                                renderRow={item => <SingleItem item={JSON.parse(item.movie)} navigation={props.navigation} />}
                            />    
                        </View>
                    )
                })}
            </View>
            : null}
            </Content>}
        </Content>
    );
};

export default MediaList;
