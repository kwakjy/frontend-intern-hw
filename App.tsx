import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {RootStackParamList} from './navigation/ParamList'
import {HomeScreen} from './screen/HomeScreen'
import {FeedScreen} from './screen/FeedScreen'

const Stack = createStackNavigator<RootStackParamList>()

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home'
          component={HomeScreen}
          options={{title: '시작 화면'}}
        />
        <Stack.Screen name='Feed'
          component={FeedScreen}
          options={{title: '슬라이드쇼'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
