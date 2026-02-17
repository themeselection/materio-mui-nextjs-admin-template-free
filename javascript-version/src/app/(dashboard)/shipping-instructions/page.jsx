/*
======== ファイル概要 ========
製造出荷指示一覧ページのトップレベルコンポーネント。フィルターバーと指示カード、各種モーダルを束ね
ており、このファイルから useShippingInstructions フックの状態とアクションを UI へ受け渡します。
*/

'use client'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import useAuthMe from '@core/hooks/useAuthMe'

import FilterBar from './components/FilterBar'
import ShippingInstructionCard from './components/ShippingInstructionCard'
import InstructionModal from './components/InstructionModal'
import ConfirmRevertDialog from './components/ConfirmRevertDialog'
import ConfirmDeleteDialog from './components/ConfirmDeleteDialog'
import CalendarModal from './components/CalendarModal'

import useShippingInstructions from './hooks/useShippingInstructions'
import { completedOptions, lineOptions } from './data/sampleInitialInstructions'

/**
 * 製造出荷指示一覧ページ。
 * @returns {JSX.Element}                                  製造指示の一覧と操作モーダルを含むページ全体。
 */
const ShippingInstructions = () => {
  const { isAdmin } = useAuthMe()
  const { state, derived, actions } = useShippingInstructions()

  const {
    dataSource, search, line, completed, date, lines, loadingLines,
    modalOpen, form, editMode, saving,
    deleteOpen, targetToDelete,
    confirmOpen,
    calendarOpen,
    availableDateItems
  } = state

  const { filtered, canPrev, canNext } = derived

  const {
    setSearch, setLine, setCompleted, setDate,
    handlePrevDate, handleNextDate,
    handleToggleComplete, handleEdit, handleRequestDelete,
    handleAdd, handleSave, handleFormChange,
    handleCancelDelete, handleConfirmDelete,
    cancelRevert, confirmRevert,
    setCalendarOpen
  } = actions

  // ======== 処理ステップ: フィルター反映 → カード一覧 → 管理モーダル群 ========
  // 1. フィルタ条件をヘッダーにまとめ、ユーザーが検索条件を即座に操作できるようにする。
  // 2. 絞り込み済みデータをカードとして並べ、ゼロ件時は案内カードでフォローする。
  // 3. 追加・編集・削除・日付選択の各モーダルを末尾に配置し、状態変化を一元管理する。

  return (
    <>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        line={line}
        onLineChange={setLine}
        completed={completed}
        onCompletedChange={setCompleted}
        date={date}
        onDateChange={setDate}
        onPrevDate={handlePrevDate}
        onNextDate={handleNextDate}
        canPrev={canPrev}
        canNext={canNext}
        lineOptions={(dataSource === 'api'
          ? [{ value: 'すべて', label: 'すべて' }, ...(lines?.map(l => ({ value: l.line_name, label: l.line_name })) || [])]
          : lineOptions)}
        completedOptions={completedOptions}
        loadingLines={dataSource === 'api' ? loadingLines : false}
        onOpenCalendar={() => setCalendarOpen(true)}
      />

      <Grid container spacing={3} alignItems='stretch'>
        {filtered.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>該当する指示が見つかりませんでした。</Typography>
              <Typography variant='body2' color='text.disabled'>検索条件を変更して、もう一度お試しください。</Typography>
            </Card>
          </Grid>
        ) : (
          filtered.map(inst => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={inst.id} sx={{ display: 'flex' }}>
              <ShippingInstructionCard instruction={inst} onToggleComplete={handleToggleComplete} onEdit={handleEdit} onDelete={handleRequestDelete} />
            </Grid>
          ))
        )}
      </Grid>

      {isAdmin && (
        <Fab color='primary' aria-label='add' sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }} onClick={handleAdd}>
          <AddIcon fontSize='large' />
        </Fab>
      )}

      <InstructionModal
        open={modalOpen}
        onClose={() => actions.setModalOpen(false)}
        onSave={handleSave}
        editMode={editMode}
        form={form}
        onFormChange={handleFormChange}
        lineOptions={(state.dataSource === 'api' ? (lines?.map(l => ({ value: l.line_name, label: l.line_name })) || []) : lineOptions)}
        saving={saving}
      />

      <ConfirmRevertDialog open={confirmOpen} onCancel={cancelRevert} onConfirm={confirmRevert} />
      <ConfirmDeleteDialog open={deleteOpen} onCancel={handleCancelDelete} onConfirm={handleConfirmDelete} itemTitle={targetToDelete?.title || targetToDelete?.productName} />

      <CalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        onSelect={(d) => { setDate(d); setCalendarOpen(false) }}
        items={availableDateItems}
        selectedDate={date}
      />
    </>
  )
}

export default ShippingInstructions

