# react-native-slide-button
Customizable slide button component for React Native.

![](http://i.imgur.com/Fue6MKo.gif)

Installation
---
```
npm i --save react-native-slide-button
```

Usage
---

```
import { SlideButton, SlideDirection } from 'react-native-slide-button';

getEndDirection(direction){
    this.setState({
        endDirection:direction
    })
}

<View style={{backgroundColor: 'blue'}}>        <!-- Outer wrapper -->
  <SlideButton
   onSlideSuccess={this.onSlide.bind(this)}
   slideDirection={SlideDirection.LEFT}
   endDirection ={this.getEndDirection.bind(this)}
   slideBackToOriginal={false}
   width={500}
   height={50}>
    <View style={height: 50, width: 500}>       <!-- Inner wrapper -->
      <Text style={styles.button}>Slide Button</Text>
    </View>
  </SlideButton>
</View>
```
* **Inner wrapper**: Contents that will move when swiped. Eg: Button text, image etc.
* **Outer wrapper**: Contents that are static and will not move. Eg: Button's background, other styles

API
---
### SlideButton

| Prop           | Type       | Default               |   Description
| -------------  |:----------:|:---------------------:|:------------------
| width          | number     | <required>            | Width of button
| height         | number     | <required>            | Height of button
| slideDirection | string     | `SlideDirection.RIGHT`| Determines which direction to slide. Either `SlideDirection.LEFT`, `SlideDirection.RIGHT`, `SlideDirection.BOTH`.
| onSlideSuccess | function   | <optional>            | Fired when slide succeeds
| onSlide        | function   | <optional>            | Fired on every movement. Distance of movement is passed as argument.
| successfulSlidePercent | number | <optional>        | Percent of total button width needed to slide before movement is seen as a successful slide. Default is 40.
| endDirection   | function   | <optional>            | Direction of the button slided by user. Useful when using `SlideDirection.BOTH`.  
| slideBackToOriginal | boolean | <optional>          | Default to true. Whether to Slide back the button back to it's original position after 1 second

TODO
---
- [x] Implement onSlide prop to let components listen to slide events.
- [ ] Write testcases.
- [ ] Write separate convenience component tailored to meet the most common usecase; button with text inside.
