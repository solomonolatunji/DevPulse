import { useTheme } from '@/hooks/useTheme';
import { Feather } from '@react-native-vector-icons/feather/static';
import React, { useRef, useState } from 'react';
import {
  TextInput as NativeTextInput,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  noSpaces?: boolean;
  size?: 'sm' | 'md' | 'lg';
  prominentLabel?: boolean;
  labelRight?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const TextInput = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  style,
  onFocus,
  onBlur,
  editable = true,
  noSpaces = false,
  containerStyle,
  size = 'md',
  prominentLabel,
  ...props
}: InputProps) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<NativeTextInput>(null);
  type InputFocusEvent = Parameters<NonNullable<TextInputProps['onFocus']>>[0];
  type InputBlurEvent = Parameters<NonNullable<TextInputProps['onBlur']>>[0];

  const handleFocus = (e: InputFocusEvent) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: InputBlurEvent) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const borderColor = error
    ? theme.colors.error
    : isFocused
      ? theme.colors.primary
      : theme.colors.border;

  const backgroundColor = editable
    ? theme.colors.surface
    : theme.colors.surfaceHighlight;

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          height: 40,
          paddingVertical: 8,
          fontSize: theme.typography.sizes.sm,
        };
      case 'lg':
        return {
          height: 56,
          paddingVertical: 16,
          fontSize: theme.typography.sizes.lg,
        };
      case 'md':
      default:
        return {
          height: 50,
          paddingVertical: 12,
          fontSize: theme.typography.sizes.md,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={styles.container}>
      {(label || props.labelRight) && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: prominentLabel ? 8 : theme.spacing[1],
          }}
        >
          {label && (
            <Typography
              variant="caption"
              weight="medium"
              style={{
                color: prominentLabel
                  ? theme.colors.text
                  : theme.colors.textSecondary,
              }}
            >
              {label}
            </Typography>
          )}
          {props.labelRight}
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor,
            paddingLeft: leftIcon ? 8 : 16,
            paddingRight: rightIcon ? 8 : 16,
            height: props.multiline ? 'auto' : sizeStyles.height,
            minHeight: props.multiline ? 100 : sizeStyles.height,
            paddingVertical: props.multiline ? 12 : 0,
            borderWidth: 1.5,
            borderRadius: 16,
            gap: theme.spacing[2],
          },
          containerStyle,
        ]}
      >
        {leftIcon && <View>{leftIcon}</View>}

        <NativeTextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              fontFamily: theme.typography.families.regular,
              fontSize: sizeStyles.fontSize,
            },
            style,
          ]}
          ref={inputRef}
          placeholderTextColor={theme.colors.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          {...props}
        />

        {rightIcon && <View>{rightIcon}</View>}
      </View>

      {error ? (
        <Typography
          variant="micro"
          style={{ color: theme.colors.error, marginTop: theme.spacing[1] }}
        >
          {error}
        </Typography>
      ) : helperText ? (
        <Typography
          variant="micro"
          style={{
            color: theme.colors.textTertiary,
            marginTop: theme.spacing[1],
          }}
        >
          {helperText}
        </Typography>
      ) : null}
    </View>
  );
};

export const PasswordInput = (props: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  return (
    <TextInput
      secureTextEntry={!showPassword}
      {...props}
      rightIcon={
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Feather
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color={theme.colors.textSecondary}
          />
        </Pressable>
      }
    />
  );
};

export const MoneyInput = ({
  currencySymbol = '₦',
  ...props
}: InputProps & { currencySymbol?: string }) => {
  return (
    <TextInput
      keyboardType="numeric"
      leftIcon={
        <Typography variant="body" style={{ marginRight: 4 }}>
          {currencySymbol}
        </Typography>
      }
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
  },
});
