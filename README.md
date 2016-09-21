# react-native-slide-button
Customizable slide button component for React Native.

![](http://i.imgur.com/Fue6MKo.gif)

Installation
---
```
npm i react-native-slide-button
```

Usage
---

```
<View style={{height: 50, width: 500}}>       <!-- Outer wrapper -->
  <SlideButton onSlideSuccess={this.onSlide.bind(this)}>
    <View style={{height: 50, width: 500}}>   <!-- Inner wrapper -->
      <Text>Slide Button</Text>
    </View>
  </SlideButton>
</View>
```
* Inner wrapper contents will be moved when swiped. Button text, for example, ,may go here.
* Outer wrapper contents are static and will not move. Button's background and other styles, may go here.

TODO
---
- [x] Implement onSlide prop to let components listen to slide events.
- [ ] Write testcases.
- [ ] Write separate convenience component tailored to meet the most common usecase; button with text inside.
