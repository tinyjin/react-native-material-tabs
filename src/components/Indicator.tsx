import React from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

import constants from '../lib/constants';

interface BarProps {
  tabWidth: number;
  tabHeight: number;
  marginHorizontal: number;
  color: string;
}

const Bar = styled(Animated.View)`
  height: ${(props: BarProps) => props.tabHeight || constants.indicatorHeight};
  width: ${(props: BarProps) => props.tabWidth};
  position: absolute;
  left: ${(props: BarProps) => props.marginHorizontal};
  right: ${(props: BarProps) => props.marginHorizontal};
  bottom: 0;
  background-color: ${(props: BarProps) => props.color};
`;

interface IndicatorProps {
  color: string;
  tabWidth: number;
  tabHeight: number;
  marginHorizontal: number;
  value: Animated.Value;
}

const Indicator = (props: IndicatorProps) => (
  <Bar
    color={props.color}
    style={{ transform: [{ translateX: props.value }] }}
    tabWidth={props.tabWidth}
    tabHeight={props.tabHeight}
    marginHorizontal={props.marginHorizontal}
  />
);

export default Indicator;
