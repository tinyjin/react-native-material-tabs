import React, { useState, useEffect, useCallback } from 'react';
import {
  Animated,
  ScrollView,
  View,
  ScrollViewProps,
  StyleProp,
  TextStyle,
  I18nManager,
} from 'react-native';

import Tab from './Tab';
import Indicator from './Indicator';
import { ContentType } from './Tab/Tab';

import { Bar, TabTrack } from '../lib/styles';
import constants from '../lib/constants';

enum Size {
  Big = 'big',
  Normal = 'normal',
  Small = 'small',
}

interface Props extends Pick<ScrollViewProps, 'keyboardShouldPersistTaps'> {
  allowFontScaling: boolean;
  selectedIndex: number;
  barColor: string;
  barHeight: number;
  activeTextColor: string;
  indicatorColor: string;
  inactiveTextColor: string;
  scrollable: boolean;
  textStyle: StyleProp<TextStyle>;
  activeTextStyle: StyleProp<TextStyle>;
  items: ContentType[];
  uppercase: boolean;
  indicatorWidthType: Size;
  indicatorHeightType: Size;
  onChange(index: number): void;
}

const getKeyForTab = (item: ContentType) =>
  typeof item === 'string' ? item : item.key;

const MaterialTabs: React.FC<Props> = ({
  items,
  selectedIndex,
  scrollable,
  keyboardShouldPersistTaps,
  barHeight,
  onChange,
  allowFontScaling,
  activeTextColor,
  textStyle,
  activeTextStyle,
  inactiveTextColor,
  uppercase,
  indicatorColor,
  indicatorWidthType,
  indicatorHeightType,
  barColor,
}) => {
  const [tabWidth, setTabWidth] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [indicatorPosition] = useState(new Animated.Value(0));
  const scrollView = React.createRef<ScrollView>();
  const bar = React.createRef<View>();
  const indicatorWidth = tabWidth / { big: 1, normal: 1.5, small: 2}[indicatorWidthType || 'big'];
  const indicatorHeight = { big: 4, normal: 2, small: 1}[indicatorHeightType || 'normal'];

  const getTabWidth = useCallback(
    (width: number = 0) => {
      if (!scrollable) {
        setTabWidth(width / items.length);
      }

      setBarWidth(width);
    },
    [items.length, scrollable]
  );

  useEffect(() => {
    const getAnimateValues = () => {
      const scrollValue = !scrollable ? tabWidth : barWidth * 0.4;

      const indicator = I18nManager.isRTL
        ? -selectedIndex * scrollValue
        : selectedIndex * scrollValue;

      // All props for fixed tabs are the same
      if (!scrollable) {
        return {
          indicatorPosition: indicator,
          scrollPosition: 0,
        };
      }

      return {
        indicatorPosition: indicator,
        scrollPosition: I18nManager.isRTL
          ? scrollValue * 0.25 +
            scrollValue * (items.length - selectedIndex - 2)
          : scrollValue * 0.25 + scrollValue * (selectedIndex - 1),
      };
    };

    const selectTab = () => {
      const values = getAnimateValues();

      Animated.spring(indicatorPosition, {
        toValue: values.indicatorPosition,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }).start();

      if (scrollView.current) {
        scrollView.current.scrollTo({
          x: values.scrollPosition,
        });
      }
    };

    bar.current &&
      bar.current.measure((_, b, width) => {
        getTabWidth(width);
      });

    selectTab();
  }, [
    bar,
    barWidth,
    getTabWidth,
    indicatorPosition,
    items.length,
    scrollView,
    scrollable,
    selectedIndex,
    tabWidth,
  ]);

  return (
    items && (
      <Bar
        ref={bar}
        barColor={barColor}
        barHeight={barHeight}
        onLayout={event => getTabWidth(event.nativeEvent.layout.width)}
      >
        <ScrollView
          horizontal
          ref={scrollView}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          scrollEnabled={scrollable}
        >
          <TabTrack barHeight={barHeight}>
            {items.map((item, idx) => (
              <Tab
                allowFontScaling={allowFontScaling}
                content={item}
                key={getKeyForTab(item) || undefined}
                onPress={() => onChange(idx)}
                active={idx === selectedIndex}
                activeTextColor={activeTextColor}
                textStyle={textStyle}
                activeTextStyle={selectedIndex === idx && activeTextStyle}
                tabHeight={barHeight}
                tabWidth={!scrollable ? tabWidth : barWidth * 0.4}
                uppercase={uppercase}
                inActiveTextColor={inactiveTextColor}
              />
            ))}
          </TabTrack>

          <Indicator
            color={indicatorColor}
            value={indicatorPosition}
            marginHorizontal={!scrollable ? (tabWidth - (indicatorWidth)) / 4 : 0}
            tabWidth={!scrollable ? indicatorWidth : barWidth * 0.2}
            tabHeight={indicatorHeight}
          />
        </ScrollView>
      </Bar>
    )
  );
};

MaterialTabs.defaultProps = {
  allowFontScaling: true,
  selectedIndex: 0,
  barColor: '#13897b',
  barHeight: constants.barHeight,
  activeTextColor: '#fff',
  indicatorColor: '#fff',
  inactiveTextColor: 'rgba(255, 255, 255, 0.7)',
  scrollable: false,
  uppercase: true,
  keyboardShouldPersistTaps: 'never',
};

export default MaterialTabs;
