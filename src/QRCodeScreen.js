import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Vibration,
  Dimensions
} from 'react-native';
import Camera from 'react-native-camera';

export default class QRCodeScreen extends Component {
  static propTypes = {
    cancelButtonVisible: React.PropTypes.bool,
    cancelButtonTitle: React.PropTypes.string,
    onSucess: React.PropTypes.func,
    onCancel: React.PropTypes.func,
  }

  static defaultProps = {
    cancelButtonVisible: false,
    cancelButtonTitle: 'Cancel'
  }

  _onPressCancel = () => {
    var $this = this;
    requestAnimationFrame(function () {
      $this.props.navigator.pop();
      if ($this.props.onCancel) {
        $this.props.onCancel();
      }
    })
  }

  _onBarCodeRead = (result) => {
    var $this = this;

    if (this.barCodeFlag) {
      this.barCodeFlag = false;

      setTimeout(function () {
        Vibration.vibrate();
        $this.props.navigator.pop();
        $this.props.onSucess(result.data);
      }, 1000)
    }
  }

  render() {
    var cancelButton = null;
    this.barCodeFlag = true;

    if (this.props.cancelButtonVisible) {
      cancelButton = <CancelButton onPress={this._onPressCancel} title={this.props.cancelButtonTitle} />;
    }

    return (
      <Camera onBarCodeRead={this._onBarCodeRead} style={styles.camera}>
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
        </View>
        {cancelButton}
      </Camera>
    )
  }
}


class CancelButton extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

var styles = StyleSheet.create({

  camera: {
    height: Dimensions.get('window').height,
    alignItems: 'center',
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },

  cancelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 3,
    padding: 15,
    width: 100,
    bottom: 10,
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#0097CE',
  },
});
