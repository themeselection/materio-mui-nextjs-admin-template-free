// 今日のお知らせカード: ダッシュボード先頭に表示されるお知らせ・連絡欄
"use client";

// React
import { useEffect, useState } from "react";

// MUI
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { alpha, useTheme } from "@mui/material/styles";
import useAuthMe from "@core/hooks/useAuthMe";

// Icons
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

// --- ▼ API・UI マッピング関数 ▼ ---

/**
 * APIレスポンス ( "高い" ) を UI内部状態 ( "important" ) に変換
 * @param {string} apiPriority "低い" | "普通" | "高い"
 * @returns {string} "normal" | "warning" | "important"
 */
const apiPriorityToUiPriority = (apiPriority) => {
  switch (apiPriority) {
    case "高い":
      return "important";
    case "普通":
      return "warning";
    case "低い":
    default:
      return "normal";
  }
};

/**
 * UI内部状態 ( "important" ) を APIリクエスト ( 3 ) に変換
 * (API設計書: 1:低い, 2:普通, 3:高い)
 * @param {string} uiPriority "normal" | "warning" | "important"
 * @returns {number} 1 | 2 | 3
 */
const uiPriorityToApiPriority = (uiPriority) => {
  switch (uiPriority) {
    case "important":
      return 3; // 高い
    case "warning":
      return 2; // 普通
    case "normal":
    default:
      return 1; // 低い
  }
};

// --- ▲ API・UI マッピング関数 ▲ ---


// UI表示に使う内部の優先度値
const PRIORITIES = {
  important: { label: "重要" },
  warning: { label: "注意" },
  normal: { label: "通常" }
};

const NoticeCard = ({ height = 160 }) => {
  // --- ▼ State 修正 ▼ ---
  const [notice, setNotice] = useState(null); // APIから取得するため初期値 null
  const [priority, setPriority] = useState("normal"); // 'important' | 'warning' | 'normal'
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftPriority, setDraftPriority] = useState("normal");
  const [updatedAt, setUpdatedAt] = useState(null); // ISO string
  const [isLoading, setIsLoading] = useState(true); // ★ローディング状態を追加
  // --- ▲ State 修正 ▲ ---
  const theme = useTheme();
  const { isAdmin } = useAuthMe();

  // --- ▼ useEffect 修正 (GET /api/message) ▼ ---
  useEffect(() => {
    // ページ読み込み時にAPIからデータを取得
    const fetchNotice = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/message');
        if (!res.ok) {
          throw new Error('お知らせの取得に失敗しました');
        }
        const data = await res.json();

        // 取得したデータで状態を更新
        setNotice(data.content);
        setPriority(apiPriorityToUiPriority(data.priority)); // マッピング関数を使用
        setUpdatedAt(data.updated_at);

      } catch (error) {
        console.error(error);
        // エラー時はデフォルト値を設定
        setNotice("（お知らせの読み込みに失敗しました）");
        setPriority("normal");
        setUpdatedAt(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, []); // [] は空のまま (マウント時に1回だけ実行)
  // --- ▲ useEffect 修正 ▲ ---

  const handleOpenEdit = () => {
    setDraft(notice);
    setDraftPriority(priority);
    setIsEditOpen(true);
  };
  const handleCloseEdit = () => setIsEditOpen(false);

  // --- ▼ handleSaveEdit 修正 (PUT /api/message) ▼ ---
  const handleSaveEdit = async () => { // ★ async を追加
    const value = draft?.trim() ?? "";
    const apiPriorityValue = uiPriorityToApiPriority(draftPriority); // ★マッピング関数を使用

    try {
      const res = await fetch('/api/message', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: value,
          priority: apiPriorityValue, // ★ 数値 (1, 2, 3) を送信
        }),
      });

      if (!res.ok) {
        // TODO: ユーザーにエラーを通知する (例: Snackbar)
        console.error('更新失敗:', await res.text());
        throw new Error('更新に失敗しました');
      }

      // APIからのレスポンス (更新後のデータ) を取得
      const updatedData = await res.json();

      // 画面の状態を更新
      setNotice(updatedData.content);
      setPriority(apiPriorityToUiPriority(updatedData.priority)); // マッピング関数を使用
      setUpdatedAt(updatedData.updated_at);

      setIsEditOpen(false); // ダイアログを閉じる

    } catch (error) {
      console.error(error);
      // TODO: ユーザーにエラーを通知する
      alert('更新に失敗しました。コンソールを確認してください。'); // alertの代わりにSnackbar推奨
    }
  };
  // --- ▲ handleSaveEdit 修正 ▲ ---

  // 重要度に応じてCardの見た目を切り替え
  const getStylesByPriority = () => {
    switch (priority) {
      case "important":
        return {
          borderColor: theme.palette.error.main,
          backgroundColor: alpha(theme.palette.error.main, 0.08),
          leftStripe: theme.palette.error.main,
          chipColor: "error"
        };
      case "warning":
        return {
          borderColor: theme.palette.warning.main,
          backgroundColor: alpha(theme.palette.warning.main, 0.08),
          leftStripe: theme.palette.warning.main,
          chipColor: "warning"
        };
      default:
        return {
          borderColor: theme.palette.divider,
          // 通常は白(紙色)に固定
          backgroundColor: theme.palette.background.paper,
          leftStripe: theme.palette.divider,
          chipColor: "default"
        };
    }
  };

  const styles = getStylesByPriority();

  const formatUpdatedAt = (iso) => {
    if (!iso) return null;
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
    } catch (_) {
      return iso;
    }
  };

  const subheader = updatedAt ? `最終更新: ${formatUpdatedAt(updatedAt)}` : undefined;

  return (
    <>
      <Card
        sx={{
          height,
          display: 'flex',
          flexDirection: 'column',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: styles.borderColor,
          bgcolor: styles.backgroundColor,
          position: 'relative',
          overflow: 'hidden',
          // 管理者以外はクリック（タップ）でモーダルが開く
          cursor: isAdmin ? 'default' : 'pointer'
        }}
        role="button"
        aria-label="今日のお知らせを表示"
        onClick={isAdmin ? undefined : handleOpenEdit} // 管理者はボタンのみ、他はカード全体
      >
        {/* 左端のストライプ */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 4,
            height: '100%',
            backgroundColor: styles.leftStripe
          }}
        />
        <CardHeader
          title={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              今日のお知らせ
              <Chip size="small" label={PRIORITIES[priority]?.label ?? '通常'} color={styles.chipColor} variant={priority === 'normal' ? 'outlined' : 'filled'} />
            </span>
          }
          subheader={subheader}
          action={
            isAdmin ? (
              <Button variant="outlined" size="small" startIcon={<CreateOutlinedIcon />} onClick={(e) => { e.stopPropagation(); handleOpenEdit(); }}>
                編集
              </Button>
            ) : null
          }
        />
        <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {/* --- ▼ ローディング表示 修正 ▼ --- */}
            {isLoading ? (
              "読み込み中..."
            ) : (
              notice && notice.length > 0 ? notice : "（お知らせは未設定です）"
            )}
            {/* --- ▲ ローディング表示 修正 ▲ --- */}
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>お知らせの編集</DialogTitle>
        <DialogContent>
          {isAdmin ? (
            <>
              <TextField
                autoFocus
                fullWidth
                multiline
                minRows={6}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="例）午後は来客あり。14時からラインBの点検を実施します。"
              />
              <div style={{ height: 12 }} />
              <FormControl component="fieldset">
                <FormLabel component="legend">重要度</FormLabel>
                <RadioGroup
                  row
                  name="notice-priority"
                  value={draftPriority}
                  onChange={(e) => setDraftPriority(e.target.value)}
                >
                  <FormControlLabel value="important" control={<Radio color="error" />} label="重要" />
                  <FormControlLabel value="warning" control={<Radio color="warning" />} label="注意" />
                  <FormControlLabel value="normal" control={<Radio />} label="通常" />
                </RadioGroup>
              </FormControl>
            </>
          ) : (
            <>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span>重要度</span>
                <Chip size="small" label={PRIORITIES[priority]?.label ?? '通常'} color={styles.chipColor} variant={priority === 'normal' ? 'outlined' : 'filled'} />
              </div>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {isLoading ? "読み込み中..." : (notice && notice.length > 0 ? notice : "（お知らせは未設定です）")}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {isAdmin ? (
            <>
              <Button onClick={handleCloseEdit} color="inherit">キャンセル</Button>
              <Button onClick={handleSaveEdit} variant="contained">保存</Button>
            </>
          ) : (
            <Button onClick={handleCloseEdit} variant="contained">閉じる</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NoticeCard;