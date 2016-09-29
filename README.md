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
<View style={{backgroundColor: 'blue'}}>        <!-- Outer wrapper -->
  <SlideButton
   onSlideSuccess={this.onSlide.bind(this)}
   width={500}
   height={50}>
    <View style={height: 50, width: 500}>       <!-- Inner wrapper -->
      <Text style={styles.button}>Slide Button</Text>
    </View>
  </SlideButton>
</View>
```
* Inner wrapper contents will be moved when swiped. Button text, for example, ,may go here.
* Outer wrapper contents are static and will not move. Button's background and other styles, may go here.

API
---
### SlideButton

| Prop           | Type       | Default              |   Description
| -------------  |:----------:|:--------------------:|:------------------
| width          | number     | <required>           | Width of button
| height         | number     | <required>           | Height of button
| slideDirection | string     | SlideDirection.RIGHT | Determines which direction to slide. Either SlideDirection.LEFT, SlideDirection.RIGHT, SlideDirection.BOTH.
| onSlideSuccess | function   | <optional>           | Fired when slide succeeds
| onSlide        | function   | <optional>           | Fired on every movement. Distance of movement is passed as argument.


TODO
---
- [x] Implement onSlide prop to let components listen to slide events.
- [ ] Write testcases.
- [ ] Write separate convenience component tailored to meet the most common usecase; button with text inside.
