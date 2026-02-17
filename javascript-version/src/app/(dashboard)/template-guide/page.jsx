'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import LinearProgress from '@mui/material/LinearProgress'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

// ExpandMoreIconの代わりにRemix Iconを使用

// Custom styled components example
const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.primary.light + '20',
  },
}))

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}))

const TemplateGuide = () => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const muiComponents = [
    {
      category: 'レイアウト',
      components: [
        {
          name: 'Grid',
          description: 'レスポンシブなグリッドレイアウト',
          usage: '<Grid container spacing={3}><Grid item xs={12} md={6}>...</Grid></Grid>',
          props: 'container, item, xs, sm, md, lg, xl, spacing',
          example: (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 1 }}>
                  xs=12, md=6
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2, bgcolor: 'secondary.light', color: 'white', borderRadius: 1 }}>
                  xs=12, md=6
                </Box>
              </Grid>
            </Grid>
          )
        },
        {
          name: 'Box',
          description: '汎用コンテナ（divの代わり）',
          usage: '<Box sx={{ p: 2, bgcolor: "primary.main" }}>...</Box>',
          props: 'sx, component, children',
          example: (
            <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, textAlign: 'center' }}>
              Box Component
            </Box>
          )
        },
        {
          name: 'Card',
          description: 'カード形式のコンテナ',
          usage: '<Card><CardContent>...</CardContent></Card>',
          props: 'variant, elevation, sx',
          example: (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">Card Example</Typography>
                <Typography variant="body2">This is a card component</Typography>
              </CardContent>
            </Card>
          )
        }
      ]
    },
    {
      category: 'タイポグラフィ',
      components: [
        {
          name: 'Typography',
          description: 'テキスト表示用コンポーネント',
          usage: '<Typography variant="h4">Title</Typography>',
          props: 'variant, color, align, gutterBottom, fontWeight',
          example: (
            <Box>
              <Typography variant="h4" gutterBottom>Heading 4</Typography>
              <Typography variant="body1" color="text.secondary">Body text</Typography>
              <Typography variant="h6" color="primary.main" fontWeight="bold">Colored text</Typography>
            </Box>
          )
        }
      ]
    },
    {
      category: 'フォーム',
      components: [
        {
          name: 'TextField',
          description: 'テキスト入力フィールド',
          usage: '<TextField label="Name" variant="outlined" size="small" />',
          props: 'label, variant, size, fullWidth, type, value, onChange',
          example: (
            <TextField
              label="Example Input"
              variant="outlined"
              size="small"
              placeholder="Enter text here"
            />
          )
        },
        {
          name: 'Button',
          description: 'ボタンコンポーネント',
          usage: '<Button variant="contained" color="primary">Click me</Button>',
          props: 'variant, color, size, startIcon, endIcon, fullWidth',
          example: (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="contained" color="primary">Primary</Button>
              <Button variant="outlined" color="secondary">Secondary</Button>
              <Button variant="text" color="success">Text</Button>
            </Box>
          )
        }
      ]
    },
    {
      category: 'ナビゲーション',
      components: [
        {
          name: 'Tabs',
          description: 'タブナビゲーション',
          usage: '<Tabs value={value} onChange={handleChange}><Tab label="Tab 1" /></Tabs>',
          props: 'value, onChange, variant, orientation',
          example: (
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Tab 1" />
                <Tab label="Tab 2" />
                <Tab label="Tab 3" />
              </Tabs>
            </Box>
          )
        },
        {
          name: 'ToggleButtonGroup',
          description: 'トグルボタングループ',
          usage: '<ToggleButtonGroup value={value} exclusive onChange={handleChange}><ToggleButton value="option1">Option 1</ToggleButton></ToggleButtonGroup>',
          props: 'value, exclusive, onChange, size',
          example: (
            <ToggleButtonGroup value={activeTab} exclusive onChange={handleTabChange} size="small">
              <ToggleButton value={0}>Option 1</ToggleButton>
              <ToggleButton value={1}>Option 2</ToggleButton>
              <ToggleButton value={2}>Option 3</ToggleButton>
            </ToggleButtonGroup>
          )
        }
      ]
    },
    {
      category: 'データ表示',
      components: [
        {
          name: 'Table',
          description: 'テーブル表示',
          usage: '<TableContainer><Table><TableHead><TableRow><TableCell>Header</TableCell></TableRow></TableHead><TableBody>...</TableBody></Table></TableContainer>',
          props: 'size, stickyHeader',
          example: (
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 200 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Item 1</TableCell>
                    <TableCell>100</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Item 2</TableCell>
                    <TableCell>200</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )
        },
        {
          name: 'Chip',
          description: '小さな情報表示用チップ',
          usage: '<Chip label="Label" color="primary" size="small" />',
          props: 'label, color, size, variant, icon',
          example: (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="Success" color="success" size="small" />
              <Chip label="Warning" color="warning" size="small" />
              <Chip label="Error" color="error" size="small" />
              <Chip label="Info" color="info" size="small" />
            </Box>
          )
        },
        {
          name: 'LinearProgress',
          description: 'プログレスバー',
          usage: '<LinearProgress variant="determinate" value={75} />',
          props: 'variant, value, color, sx',
          example: (
            <Box sx={{ width: '100%' }}>
              <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4 }} />
              <Typography variant="body2" sx={{ mt: 1 }}>75% Complete</Typography>
            </Box>
          )
        }
      ]
    },
    {
      category: 'アイコン・アバター',
      components: [
        {
          name: 'Avatar',
          description: 'ユーザーアバターやアイコン表示',
          usage: '<Avatar src="/path/to/image.png" variant="rounded" />',
          props: 'src, alt, variant, sx',
          example: (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
              <Avatar src="/images/avatars/1.png" />
              <Avatar variant="rounded" sx={{ bgcolor: 'secondary.main' }}>B</Avatar>
            </Box>
          )
        },
        {
          name: 'IconButton',
          description: 'アイコンボタン',
          usage: '<IconButton size="small" color="primary"><Icon /></IconButton>',
          props: 'size, color, disabled, onClick',
          example: (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="primary">
                <span>👁️</span>
              </IconButton>
              <IconButton size="small" color="secondary">
                <span>✏️</span>
              </IconButton>
              <IconButton size="small" color="error">
                <span>🗑️</span>
              </IconButton>
            </Box>
          )
        }
      ]
    }
  ]

  const reactPatterns = [
    {
      category: '状態管理',
      patterns: [
        {
          name: 'useState',
          description: 'コンポーネントの状態を管理',
          usage: 'const [value, setValue] = useState(initialValue)',
          example: 'const [activeTab, setActiveTab] = useState(0)',
          explanation: 'コンポーネント内で値を保持し、変更時に再レンダリングをトリガーします'
        },
        {
          name: 'useEffect',
          description: '副作用を実行（API呼び出し、イベントリスナーなど）',
          usage: 'useEffect(() => { /* effect */ }, [dependencies])',
          example: 'useEffect(() => { window.addEventListener("resize", handler); return () => window.removeEventListener("resize", handler); }, [])',
          explanation: 'コンポーネントのマウント時、アンマウント時、依存関係の変更時に実行されます'
        },
        {
          name: 'useRef',
          description: 'DOM要素への参照を保持',
          usage: 'const ref = useRef(null)',
          example: 'const chartContainerRef = useRef(null)',
          explanation: 'DOM要素に直接アクセスする必要がある場合に使用します'
        }
      ]
    },
    {
      category: 'イベントハンドリング',
      patterns: [
        {
          name: 'onChange Handler',
          description: 'フォーム入力の変更を処理',
          usage: 'onChange={(e) => setValue(e.target.value)}',
          example: 'onChange={(e) => setFilterName(e.target.value)}',
          explanation: '入力フィールドの値が変更されたときに状態を更新します'
        },
        {
          name: 'onClick Handler',
          description: 'クリックイベントを処理',
          usage: 'onClick={() => handleClick()}',
          example: 'onClick={() => setActiveTab(index)}',
          explanation: 'ボタンやカードがクリックされたときの動作を定義します'
        }
      ]
    },
    {
      category: '条件付きレンダリング',
      patterns: [
        {
          name: 'Ternary Operator',
          description: '条件に基づいて異なるコンテンツを表示',
          usage: '{condition ? <ComponentA /> : <ComponentB />}',
          example: '{isLoading ? <Spinner /> : <Content />}',
          explanation: 'シンプルな条件分岐でコンポーネントを切り替えます'
        },
        {
          name: 'Logical AND',
          description: '条件が真の時のみコンポーネントを表示',
          usage: '{condition && <Component />}',
          example: '{user && <UserProfile user={user} />}',
          explanation: '条件が真の時のみコンポーネントをレンダリングします'
        },
        {
          name: 'Conditional Return',
          description: '関数内で早期リターン',
          usage: 'if (condition) return <Component />',
          example: 'if (filteredData.length === 0) return <EmptyState />',
          explanation: '特定の条件で異なるコンポーネントを返します'
        }
      ]
    },
    {
      category: 'リストレンダリング',
      patterns: [
        {
          name: 'map()',
          description: '配列の要素をコンポーネントに変換',
          usage: '{array.map((item, index) => <Component key={item.id} {...item} />)}',
          example: '{filteredData.map((row, index) => <TableRow key={index}>...</TableRow>)}',
          explanation: '配列の各要素をReactコンポーネントに変換して表示します'
        },
        {
          name: 'filter()',
          description: '配列を条件でフィルタリング',
          usage: 'array.filter(item => condition)',
          example: 'productionData.filter(d => d.date === today)',
          explanation: '条件に合う要素のみを抽出して表示します'
        }
      ]
    }
  ]

  const stylingExamples = [
    {
      category: 'sx prop',
      examples: [
        {
          name: '基本的なスタイリング',
          usage: 'sx={{ p: 2, bgcolor: "primary.main", color: "white" }}',
          explanation: 'padding: 16px, background-color: primary.main, color: white'
        },
        {
          name: 'レスポンシブデザイン',
          usage: 'sx={{ display: { xs: "none", md: "block" } }}',
          explanation: 'xs（モバイル）では非表示、md（タブレット以上）では表示'
        },
        {
          name: 'レイアウト',
          usage: 'sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}',
          explanation: 'flexboxレイアウトで要素を中央揃え'
        },
        {
          name: 'スペーシング',
          usage: 'sx={{ "& > * + *": { mt: 2 } }}',
          explanation: '子要素の間隔を2（16px）に設定'
        }
      ]
    },
    {
      category: 'styled()',
      examples: [
        {
          name: 'カスタムスタイル',
          usage: 'const StyledButton = styled(Button)(({ theme }) => ({ /* styles */ }))',
          explanation: '既存のMUIコンポーネントをカスタマイズ'
        },
        {
          name: 'テーマ利用',
          usage: 'color: theme.palette.primary.main',
          explanation: 'MUIテーマの色やスペーシングを利用'
        }
      ]
    }
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            MUI & React テンプレートガイド
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            このページでは、テンプレートで使用されているMUIコンポーネントとReactパターンの使い方を説明します。
          </Typography>
        </Grid>

        {/* MUI Components */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                MUI コンポーネント一覧
              </Typography>
              {muiComponents.map((category, categoryIndex) => (
                <Accordion key={categoryIndex}>
                  <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
                    <Typography variant="h6">{category.category}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {category.components.map((component, componentIndex) => (
                        <Grid item xs={12} key={componentIndex}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="h6" color="primary" gutterBottom>
                                {component.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {component.description}
                              </Typography>
                              <Typography variant="body2" component="pre" sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 1, fontSize: '0.75rem' }}>
                                {component.usage}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>主要なprops:</strong> {component.props}
                              </Typography>
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" gutterBottom>
                                  <strong>例:</strong>
                                </Typography>
                                {component.example}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* React Patterns */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                React パターン一覧
              </Typography>
              {reactPatterns.map((category, categoryIndex) => (
                <Accordion key={categoryIndex}>
                  <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
                    <Typography variant="h6">{category.category}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {category.patterns.map((pattern, patternIndex) => (
                        <Grid item xs={12} key={patternIndex}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="h6" color="primary" gutterBottom>
                                {pattern.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {pattern.description}
                              </Typography>
                              <Typography variant="body2" component="pre" sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 1, fontSize: '0.75rem' }}>
                                {pattern.usage}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>例:</strong> {pattern.example}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>説明:</strong> {pattern.explanation}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Styling Examples */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                スタイリング例
              </Typography>
              {stylingExamples.map((category, categoryIndex) => (
                <Accordion key={categoryIndex}>
                  <AccordionSummary expandIcon={<i className='ri-arrow-down-s-line' />}>
                    <Typography variant="h6">{category.category}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {category.examples.map((example, exampleIndex) => (
                        <Grid item xs={12} key={exampleIndex}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="h6" color="primary" gutterBottom>
                                {example.name}
                              </Typography>
                              <Typography variant="body2" component="pre" sx={{ bgcolor: 'grey.100', p: 1, borderRadius: 1, fontSize: '0.75rem' }}>
                                {example.usage}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>説明:</strong> {example.explanation}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Reference Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                クイックリファレンス
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>コンポーネント</TableCell>
                      <TableCell>用途</TableCell>
                      <TableCell>よく使うprops</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Grid</strong></TableCell>
                      <TableCell>レスポンシブレイアウト</TableCell>
                      <TableCell>container, item, xs, md, lg, spacing</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Card</strong></TableCell>
                      <TableCell>コンテンツのグループ化</TableCell>
                      <TableCell>variant, elevation, sx</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Typography</strong></TableCell>
                      <TableCell>テキスト表示</TableCell>
                      <TableCell>variant, color, align, gutterBottom</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>TextField</strong></TableCell>
                      <TableCell>フォーム入力</TableCell>
                      <TableCell>label, variant, size, fullWidth</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Button</strong></TableCell>
                      <TableCell>アクション実行</TableCell>
                      <TableCell>variant, color, size, startIcon</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Table</strong></TableCell>
                      <TableCell>データ表示</TableCell>
                      <TableCell>size, stickyHeader</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TemplateGuide
