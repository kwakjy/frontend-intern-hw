import React, {useState, useEffect, useRef, useCallback} from 'react'
import {Text, Button, Animated} from 'react-native'
import styled from '@emotion/native'
import {RootStackParamList} from '../navigation/ParamList'
import {StackNavigationProp} from '@react-navigation/stack'
import {RouteProp} from '@react-navigation/native'
import imageView from '../component/ImageView'
import {Flickr_URL} from '../assets/url/FlickrURL'

type FeedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Feed'>
type FeedScreenRouteProp = RouteProp<RootStackParamList, 'Feed'>

interface Props {
  navigation: FeedScreenNavigationProp
  route: FeedScreenRouteProp
}

interface Media {
  m: string
}

interface Item {
  media: Media
}

interface Response {
  items: Array<Item>
}

export const FeedScreen: React.FC<Props> = (Props) => {
  const {navigation, route} = Props

  const second = route.params?.second
  const firstFadeValue = useRef(new Animated.Value(0)).current
  const secondFadeValue = useRef(new Animated.Value(0)).current
  const [imageArray, setImageArray] = useState<Array<string>>([])
  const [copyImageArray, setCopyImageArray] = useState<Array<string>>([])
  const [isFetchNeeded, setFetchNeeded] = useState(true)
  const [isMounted, setIsMounted] = useState(true)
  const [isFirstDelayOver, setIsFirstDelayOver] = useState(false)
  const [isSecondDelayOver, setIsSecondDelayOver] = useState(false)
  const [firstRun, setFirstRun] = useState(true)

  const fetchImage = useCallback(async (): Promise<Array<string>> => {
    const response = await fetch(Flickr_URL)
    const json: Response = (await response.json()) as Response
    return json.items.map((item) => item.media.m)
  }, [])

  useEffect(() => {
    if (isFetchNeeded) {
      void fetchImage()
        .then((newImageArray) => {
          setImageArray((current) => {
            current.push(...newImageArray)
            return current
          })
          setFetchNeeded(false)
        })
    }
  }, [isFetchNeeded])

  const fadeAnimation = (fadeValue: Animated.Value, toValue: number) => Animated.timing(fadeValue, {
    toValue: toValue,
    duration: 1000,
    useNativeDriver: true
  })

  const firstImageFadeIn = fadeAnimation(firstFadeValue, 1)
  const firstImageFadeOut = fadeAnimation(firstFadeValue, 0)
  const secondImageFadeIn = fadeAnimation(secondFadeValue, 1)
  const secondImageFadeOut = fadeAnimation(secondFadeValue, 0)

  const firstImageAnimation = useCallback(() => {
    Animated.sequence(
      [firstImageFadeIn, Animated.delay(second * 1000)]
    ).start(() => {
      setCopyImageArray(imageArray)
      setIsFirstDelayOver(true)
      firstImageFadeOut.start(() => {
        setImageArray(imageArray.slice(2))
        if (imageArray.length === 6)
          setFetchNeeded(true)
      })
    })
  }, [imageArray, copyImageArray])

  const secondImageAnimation = useCallback(() => {
    Animated.sequence(
      [secondImageFadeIn, Animated.delay(second * 1000)]
    ).start(() => {
      setIsSecondDelayOver(true)
      secondImageFadeOut.start(() => {
      })
    })
  }, [])

  const runAnimation = useCallback(() => {
    if (isMounted) {
      if (firstRun || isSecondDelayOver) {
        firstImageAnimation()
        setIsSecondDelayOver(false)
        setFirstRun(false)
      }
      if (isFirstDelayOver) {
        secondImageAnimation()
        setIsFirstDelayOver(false)
      }
    }
  }, [imageArray, copyImageArray, isFirstDelayOver, isSecondDelayOver, firstRun])

  useEffect(() => {
    setIsMounted(true)
    runAnimation()
    return () => {setIsMounted(false)}
  }, [imageArray.length, copyImageArray.length, isFirstDelayOver, isSecondDelayOver])

  const firstImageView = imageView(imageArray[0])
  const secondImageView = imageView(copyImageArray[1])

  return (
    <MainView>
      <AnimationView style={[{opacity: firstFadeValue}]}>
        {firstImageView}
      </AnimationView>
      <AnimationView style={[{opacity: secondFadeValue}]}>
        {secondImageView}
      </AnimationView>
      <TextButtonContainer>
        <Text>현재 슬라이드 시간(초)</Text>
        <Text>{second}초</Text>
        <Button title='슬라이드 시간 변경'
          onPress={() => navigation.navigate('SetTime', {screen: 'Feed'})}
        />
        <Button title='홈화면으로'
          onPress={() => navigation.navigate('Home', {second: second})}
        />
      </TextButtonContainer>
    </MainView>
  )
}

const MainView = styled.View({
  backgroundColor: 'white',
  flex: 1,
  justifyContent: 'space-around',
  alignItems: 'center'
})

const AnimationView = styled(Animated.View)({
  position: 'absolute',
  top: 60,
  flex: 2,
  justifyContent: 'center',
  alignItems: 'center'
})

const TextButtonContainer = styled.View({
  bottom: 100,
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center'
})
