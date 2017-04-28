import { createElement, Component } from 'rax';
import RaxLogo from './rax.svg';
import View from 'rax-view';
import Image from 'rax-image';
import Text from 'rax-text';
import Button from 'rax-button';

class App extends Component {
  render() {
    return (
      <View style={{ margin: '2em auto', width: '100%', textAlign: 'center' }}>
        <Text
          style={{
            fontFamily: '-apple-system, "Helvetica Neue", Roboto, sans-serif',
            fontStyle: 'italic',
            fontWeight: 900,
            color: '#ff3f00',
            marginBottom: '1em',
          }}
        >
          Razzle + Rax
        </Text>
        <Image
          source={{
            uri: RaxLogo,
          }}
          style={{
            width: 100,
            height: 100,
            margin: '2em auto',
            display: 'block',
          }}
          resizeMode="cover"
        />

        <Button
          onPress={evt => {
            alert('你好');
          }}
        >
          点我
        </Button>
      </View>
    );
  }
}

export default App;
