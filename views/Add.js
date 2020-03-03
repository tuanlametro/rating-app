import React, { useEffect, useState } from 'react';
import { Container, Content, Text, Header, Body, Title, Left, Icon, Button, Right, Card, CardItem, Root, Toast } from 'native-base';
import { Image, AsyncStorage } from 'react-native';
import uploadHook from '../hooks/UploadHook';

const Add = ({ route, navigation }) => {
    const { details } = route.params;
    const [token, setToken] = useState();
    const { handleUpload } = uploadHook();

    const add = async () => {
        try {
            const response = await handleUpload(details, navigation);
            if (response.file_id) {
                Toast.show({
                    text: response.message,
                    type: 'success',
                });
                setTimeout(() => {
                    navigation.navigate('Home');
                }, 1500);
            } else {
                Toast.show({
                    text: 'Error: ' + response.message,
                });
            }
        } catch (error) {
            console.log('add error: ', error.message);
        }
    };

    const checkAuth = async () => {
        try {
            const tokenFromStorage = await AsyncStorage.getItem('token');
            if (tokenFromStorage) {
                setToken(tokenFromStorage);
            }
        } catch (error) {
            console.log('checkAuth error: ', error.message);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <Root>
            <Container>
                <Header>
                    <Left>
                        <Button iconLeft transparent onPress={() => navigation.goBack()}>
                            <Icon name='arrow-back' />
                            <Text style={{fontSize: 20}}>Back</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Add</Title>
                    </Body>
                    <Right />
                </Header>
                <Content scrollEnabled={false}>
                    <Card>
                        <CardItem bordered>
                            {details.Poster ? <Image source={{uri: details.Poster}} style={{height: 200, width: null, flex: 1}} /> : null}
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                <Title> {details.Title} <Text note > {details.Type} </Text> </Title>
                                <Text> Genres: {details.Genre} </Text>
                                <Text> Duration: {details.Runtime} </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    {token ?
                    <Button full success onPress={add}>
                        <Text>Add to database</Text>
                    </Button>
                    :
                    <Button full bordered onPress={() => navigation.push('Auth')}>
                        <Text>Login to continue</Text>    
                    </Button>}
                </Content>
            </Container>
        </Root>
    );
};

export default Add;
