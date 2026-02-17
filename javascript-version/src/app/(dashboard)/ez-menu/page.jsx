"use client";

/*
======== ファイル概要 ========
工場ダッシュボード向けの簡易メニュー画面。お知らせのローカル保存と主要機能へのショートカットカードをまとめて提供する。
*/

// React Imports
import { useEffect, useState } from "react";

// Next Imports
import Link from "@/components/Link";

// MUI Imports
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

// Icons
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HardwareIcon from "@mui/icons-material/Hardware";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

/**
 * EZ メニューのトップページコンポーネント。
 * @returns {JSX.Element} - お知らせカードと主要機能へのリンクカード群をまとめたグリッド。
 */
const EzMenuPage = () => {
	// 今日のお知らせ（ローカル保存共有）
	const STORAGE_KEY = "dashboard_notice_v1";
	const [notice, setNotice] = useState(
		"本日の安全第一。午後は来客予定があります。\n17:00 までに作業場の整理整頓をお願いします。"
	);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [draft, setDraft] = useState("");

	useEffect(() => {
		// ======== 処理ステップ: 初回読込 → localStorage 取得 → ステート反映 ========
		// 1. 初回読込ではブラウザ環境かを確認し SSR 実行時の参照エラーを防ぐ。
		// 2. localStorage 取得で前回編集内容を読み出し、複数ユーザーの共有 PC でも内容を継続させる。
		// 3. ステート反映で空文字を避け、表示テキストが消えないようにガードする。
		try {
			const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
			if (saved && saved.trim().length > 0) setNotice(saved);
		} catch (e) {
			// ignore
		}
	}, []);

	/**
	 * 編集モーダルを開くためのハンドラ。
	 * @returns {void}
	 */
	const openEdit = () => {
		setDraft(notice);
		setIsEditOpen(true);
	};

	/**
	 * 編集モーダルを閉じる。
	 * @returns {void}
	 */
	const closeEdit = () => setIsEditOpen(false);

	/**
	 * 編集したお知らせを保存する。
	 * @returns {void}
	 */
	const saveEdit = () => {
		const v = draft?.trim() ?? "";
		setNotice(v);
		try {
			if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, v); // ローカル保持でページ更新しても内容が残る。
		} catch (e) {}
		setIsEditOpen(false);
	};

	return (
		<Grid container spacing={6} sx={{ mt: 0 }}>
			{/* お知らせ（大きめ表示） */}
			<Grid item xs={12}>
				<Card>
					<CardHeader
						title="今日のお知らせ"
						action={
							<Button variant="outlined" size="small" startIcon={<CreateOutlinedIcon />} onClick={openEdit}>
								編集
							</Button>
						}
					/>
					<CardContent>
						<Typography variant="h6" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
							{notice && notice.length > 0 ? notice : "（お知らせは未設定です）"}
						</Typography>
						<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
							ブラウザに保存されます。全員共通にする場合はAPI保存に切替えてください。
						</Typography>
					</CardContent>
				</Card>
			</Grid>

			{/* 大きなクイックボタン（スマホ操作を想定） */}
			<Grid item xs={12}>
				<Grid container spacing={4}>
							{/* 製造出荷指示 */}
										<Grid item xs={12} sm={6} md={4}>
						<Card sx={{ height: '100%' }}>
							<CardActionArea component={Link} href="/shipping-instructions" sx={{ height: '100%' }}>
										<CardContent sx={{ py: 5, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
									<Box sx={{ bgcolor: 'warning.main', color: 'common.white', width: 88, height: 88, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<ListAltOutlinedIcon sx={{ fontSize: 44 }} />
									</Box>
									<Typography variant="h5" fontWeight={700} textAlign="center">
										製造出荷指示
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					</Grid>

					{/* 日報システム */}
										<Grid item xs={12} sm={6} md={4}>
						<Card sx={{ height: '100%' }}>
							<CardActionArea component={Link} href="/daily-reports" sx={{ height: '100%' }}>
														<CardContent sx={{ py: 5, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
									<Box sx={{ bgcolor: 'info.main', color: 'common.white', width: 88, height: 88, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<CreateOutlinedIcon sx={{ fontSize: 44 }} />
									</Box>
									<Typography variant="h5" fontWeight={700} textAlign="center">
										日報システム
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					</Grid>

					{/* 部品在庫管理 */}
										<Grid item xs={12} sm={6} md={4}>
						<Card sx={{ height: '100%' }}>
							<CardActionArea component={Link} href="/parts-inventory" sx={{ height: '100%' }}>
														<CardContent sx={{ py: 5, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
									<Box sx={{ bgcolor: 'success.main', color: 'common.white', width: 88, height: 88, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<Inventory2OutlinedIcon sx={{ fontSize: 44 }} />
									</Box>
									<Typography variant="h5" fontWeight={700} textAlign="center">
										部品在庫管理
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					</Grid>
				</Grid>

												{/* KPI/タスクへのリンクボタン */}
												<Grid item xs={12} sx={{ mt: 4 }}>
							<Grid container spacing={4}>
								{/* 生産進捗 */}
								<Grid item xs={12} sm={6} md={3}>
									<Card sx={{ height: '100%' }}>
										<CardActionArea component={Link} href="/production-management" sx={{ height: '100%' }}>
																	<CardContent sx={{ py: 5, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
												<Box sx={{ bgcolor: 'primary.main', color: 'common.white', width: 88, height: 88, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
													<TrendingUpIcon sx={{ fontSize: 44 }} />
												</Box>
												<Typography variant="h6" fontWeight={700} textAlign="center">
													生産進捗
												</Typography>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>

								{/* 直近エラーログ */}
								<Grid item xs={12} sm={6} md={3}>
									<Card sx={{ height: '100%' }}>
										<CardActionArea component={Link} href="/machine-status" sx={{ height: '100%' }}>
																	<CardContent sx={{ py: 5, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
												<Box sx={{ bgcolor: 'error.main', color: 'common.white', width: 88, height: 88, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
													<HardwareIcon sx={{ fontSize: 44 }} />
												</Box>
												<Typography variant="h6" fontWeight={700} textAlign="center">
													直近エラーログ
												</Typography>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>

								{/* 画像検査ステータス */}
								<Grid item xs={12} sm={6} md={3}>
									<Card sx={{ height: '100%' }}>
										<CardActionArea component={Link} href="/image-inspection" sx={{ height: '100%' }}>
																	<CardContent sx={{ py: 5, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
												<Box sx={{ bgcolor: 'info.main', color: 'common.white', width: 88, height: 88, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
													<CameraAltOutlinedIcon sx={{ fontSize: 44 }} />
												</Box>
												<Typography variant="h6" fontWeight={700} textAlign="center">
													画像検査ステータス
												</Typography>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>

								{/* 本日のタスク */}
								<Grid item xs={12} sm={6} md={3}>
									<Card sx={{ height: '100%' }}>
										<CardActionArea component={Link} href="/shipping-instructions" sx={{ height: '100%' }}>
																	<CardContent sx={{ py: 5, minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
												<Box sx={{ bgcolor: 'warning.main', color: 'common.white', width: 88, height: 88, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
													<ListAltOutlinedIcon sx={{ fontSize: 44 }} />
												</Box>
												<Typography variant="h6" fontWeight={700} textAlign="center">
													本日のタスク
												</Typography>
											</CardContent>
										</CardActionArea>
									</Card>
								</Grid>
							</Grid>
						</Grid>
			</Grid>

			{/* 編集モーダル */}
			<Dialog open={isEditOpen} onClose={closeEdit} fullWidth maxWidth="sm">
				<DialogTitle>お知らせの編集</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						fullWidth
						multiline
						minRows={6}
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						placeholder="例）午後は来客あり。14時からラインBの点検を実施します。"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeEdit} color="inherit">キャンセル</Button>
					<Button onClick={saveEdit} variant="contained">保存</Button>
				</DialogActions>
			</Dialog>
		</Grid>
	);
};

export default EzMenuPage;

