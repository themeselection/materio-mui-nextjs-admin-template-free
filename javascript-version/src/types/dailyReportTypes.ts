// APIから返ってくるデータ（1件分）
export type DailyReport = {
  report_id: number
  employee_id: number
  employee_name: string
  line_id: number
  line_name: string     // UIの「製品名」として使用
  report_date: string   // UIの「日付」として使用
  notes: string | null  // UIの「作業内容」として使用
  updated_at: string
}

// 新規作成・編集で送るデータ
export type ReportFormData = {
  employee_id: number | string
  line_id: number | string
  report_date: string
  notes: string
}