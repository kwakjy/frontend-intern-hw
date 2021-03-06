import React, {useEffect} from 'react'
import {Text, Button, BackHandler, Alert} from 'react-native'
import styled from '@emotion/native'
import {RootStackParamList} from '../navigation/ParamList'
import {StackNavigationProp} from '@react-navigation/stack'
import {RouteProp} from '@react-navigation/native'
// @ts-ignore
import FlickrLogo from '../assets/image/FlickrLogo.png'

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>

interface Props {
  navigation: HomeScreenNavigationProp
  route: HomeScreenRouteProp
}

export const HomeScreen: React.FC<Props> = (Props) => {
  const {navigation, route} = Props
  const second = route.params?.second

  const backButtonAction = () => {
    Alert.alert('FlickrAlbumApp', '앱을 정말로 종료하시겠습니까?', [
      {text: '취소', onPress: () => null},
      {text: '네', onPress: () => BackHandler.exitApp()},
    ])
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backButtonAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backButtonAction)
  }, [])

  const handleSlideTimeSettingButtonPress = () => {
    navigation.navigate('TimeSetting', {whatScreen: 'Home', second: second})
  }

  const handleSlideStartButtonPress = () => {
    if (second === undefined) {
      Alert.alert('시간을 선택하지 않았습니다.')
    } else {
      navigation.navigate('Feed', {second: second})
    }
  }

  return (
    <MainContainer>
      <TitleContainer>
        <LogoImage source={(FlickrLogo)}/>
        <Title>Album App</Title>
      </TitleContainer>
      <TextButtonContainer>
        <Text>{second === undefined ? '환영합니다. 슬라이드 시간을 설정해주세요.' : '현재 슬라이드 시간(초)'}</Text>
        <Text>{second}{second === undefined ? ' ' : '초'}</Text>
        <Button
          title='슬라이드 시간 변경'
          onPress={handleSlideTimeSettingButtonPress}
        />
        <Button
          title='슬라이드 시작'
          onPress={handleSlideStartButtonPress}
        />
      </TextButtonContainer>
    </MainContainer>
  )
}

const MainContainer = styled.SafeAreaView({
  backgroundColor: 'white',
  flex: 1,
  justifyContent: 'space-around',
  alignItems: 'center',
})

const TitleContainer = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
})

const TextButtonContainer = styled.View({
  flex: 1.7,
  justifyContent: 'center',
  alignItems: 'center',
})

const LogoImage = styled.Image({
  width: 100,
  height: 50,
  resizeMode: 'contain',
})

const Title = styled.Text({
  fontSize: 40,
  fontWeight: 'bold',
})
