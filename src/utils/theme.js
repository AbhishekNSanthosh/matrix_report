import { createTheme, responsiveFontSizes } from '@mui/material';

const DEFAULT_VERTICAL_PADDING = 13;

const font = "'Manrope', sans-serif;";

let themeConfig = createTheme({
  typography: {
    fontFamily: font,
    fontSize: 12.8,
    color: '#383A42'
  },
  palette: {
    primary: {
      light: '#202020',
      main: '#259FCA',
      dark: '#797979',
      contrastText: '#fff'
    },
    secondary: {
      light: '#3D82BC',
      main: '#EAEAEA',
      dark: '#797979',
      contrastText: '#fff'
    },
    light: {
      light: '#fff',
      main: '#fff',
      dark: '#f2f2f2',
      contrastText: '#000'
    },
    text: {
      main: '#202020',
      light: '#FFFFFF',
      secondary: '#7a7a84'
    }
    // divider: '#E9E9EC'
  },
  footer: {
    bgColor: '#1D1D1D',
    textColor: '#fff'
  },
  border: {
    lightGrey: '#D5D9E0',
    lightGreen: '#e4f5e9'
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          textAlign: 'left',
          whiteSpace: 'pre-line'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#fff',
          color: '#000'
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 6
        },
        select: {
          paddingTop: DEFAULT_VERTICAL_PADDING,
          paddingBottom: DEFAULT_VERTICAL_PADDING,
          '&:focus': {
            backgroundColor: 'transparent'
          }
        }
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          '& .MuiTypography-root': {
            fontSize: 15
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          lineHeight: 1.28
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          [`& fieldset`]: {
            borderRadius: 6
          },
          ['& .MuiOutlinedInput-input']: {
            paddingTop: DEFAULT_VERTICAL_PADDING,
            paddingBottom: DEFAULT_VERTICAL_PADDING,
            fontSize: 14
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderWidth: 1.5
            }
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          borderWidth: 0,
          '&:hover:not(.Mui-focused):not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(76, 78, 100, 0.5)'
          }
        },
        input: {
          '&:-webkit-autofill': {
            '-webkit-box-shadow': '0 0 0 100px #ededed inset',
            '-webkit-text-fill-color': '#000'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        containedSecondary: {
          backgroundColor: '#259FCA', // Light Orange background color
          color: '#FFFFFF',
          ':hover': {
            backgroundColor: '#3D82BC', // Light Orange (hover) background color
            color: '#FFFFFF'
          }
        },
        outlinedPrimary: {
          borderColor: '#202020'
        },
        root: ({ ownerState }) => ({
          paddingTop: 8,
          paddingBottom: 8,
          borderRadius: 6,
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: 14,
          ...(ownerState.variant === 'outlined' && {
            border: '1px solid #259FCA',
            color: '#FE7F1D'
          })
        })
      },
      defaultProps: {
        disableElevation: true,
        color: 'secondary'
      }
    },
    MuiCard: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: 16,
          backgroundColor: '#fff',
          border: '1px solid #e7e7e7',
          boxShadow: 'rgb(0 0 0 / 12%) 0px 1px 15px 0px',
          ...(ownerState.variant === 'outlined' && { boxShadow: 'none' })
        })
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E9E9EC'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize'
          // py: 1.5
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          // border: 0,
          // color: theme.palette.text.primary,
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none'
          },
          borderWidth: 0
        },
        columnHeaders: {
          maxHeight: '54px !important',
          minHeight: '54px !important',
          lineHeight: '24px !important',
          // backgroundColor: theme.palette.customColors.tableHeaderBg
          backgroundColor: '#F5F5F7',
          paddingLeft: '10px'
        },
        columnHeaderTitle: {
          fontSize: '12px',
          // letterSpacing: '0.17px',
          textTransform: 'uppercase',
          fontWeight: 500,
          lineHeight: '16px'
        },
        row: {
          '&:last-child': {
            '& .MuiDataGrid-cell': {
              borderBottom: 0
            }
          }
        },
        cell: {
          paddingLeft: '20px'
        }
      },
      defaultProps: {
        rowHeight: 50,
        headerHeight: 54
      }
    },
    MuiChip: {
      styleOverrides: {
        iconColorDefault: {
          color: '#fff'
        },
        outlined: {
          '&.MuiChip-colorDefault': {
            borderColor: `#259FCA`,
            padding: '10px',
            fontWeight: 600
          }
        },
        filled: {
          '&.MuiChip-colorDefault': {
            backgroundColor: `#259FCA`,
            color: '#fff',
            padding: '10px',
            fontWeight: 600
          }
        }
      }
    }
  }
});

themeConfig = responsiveFontSizes(themeConfig);

export const defaultTheme = themeConfig;
