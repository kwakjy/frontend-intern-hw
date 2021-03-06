import React, {useEffect, useState} from 'react'
import {Text, Button} from 'react-native'
import styled from '@emotion/native'
import {RootStackParamList} from '../navigation/ParamList'
import {StackNavigationProp} from '@react-navigation/stack'
import {RouteProp} from '@react-navigation/native'
import TimePicker from '../component/TimePicker'

type SetTimeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TimeSetting'>
type SetTimeScreenRouteProp = RouteProp<RootStackParamList, 'TimeSetting'>

type Props = {
  navigation: SetTimeScreenNavigationProp
  route: SetTimeScreenRouteProp
}

export const TimeSettingScreen: React.FC<Props> = (Props) => {
  const {navigation, route} = Props
  const whatScreen = route.params.whatScreen
  const second = route.params.second

  const [selectedTime, setSelectedTime] = useState(second)

  useEffect(() => {
    setSelectedTime(second ?? 1)
  }, [second])

  const handlePreviousButtonPress = () => {
    if (whatScreen === 'Home') {
      navigation.navigate('Home', {second: selectedTime})
    } else if (whatScreen === 'Feed') {
      navigation.navigate('Feed', {second: selectedTime})
    }
  }

  return (
    <MainContainer>
      <Text>이미지 하나가 보여질 시간(1~10초)을 선택하세요.</Text>
      <TimePicker
        selectedNumber={selectedTime}
        onNumberChange={setSelectedTime}
      />
      <Button
        title='원래화면으로'
        onPress={handlePreviousButtonPress}
      />
    </MainContainer>
  )
}

const MainContainer = styled.SafeAreaView({
  backgroundColor: 'white',
  flex: 1,
  justifyContent: 'space-evenly',
  alignItems: 'center',
})
