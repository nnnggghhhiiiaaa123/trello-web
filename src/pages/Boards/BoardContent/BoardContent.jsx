import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

import {
    DndContext,
    DragOverlay,
    //PointerSensor,
    MouseSensor,
    TouchSensor,
    defaultDropAnimationSideEffects,
    useSensor,
    useSensors,
    closestCorners,
    pointerWithin,
    rectIntersection
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState, useCallback } from 'react'
import { cloneDeep } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
    CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }) {
    //const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

    const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

    const touchSensor = useSensor(MouseSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

    //const mySensors = useSensors(pointerSensor)
    const sensors = useSensors(mouseSensor, touchSensor)


    const [orderedColumns, setOrderedColumns] = useState([])

    // Cùng một thời điểm chỉ có một phần tử đang được kéo ( column hoặc card )
    const [activeDragItemId, setActiveDragItemId] = useState(null)
    const [activeDragItemType, setActiveDragItemType] = useState(null)
    const [activeDragItemData, setActiveDragItemData] = useState(null)
    const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

    useEffect(() => {
        const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
        setOrderedColumns(orderedColumns)
    }, [board])

    const findColumnByCardId = (cardId) => {
        return orderedColumns.find(column => column?.cards?.map(card => card._id).includes(cardId))
    }

    const moveCardBetweenDifferentColumns = (
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
    ) => {
        setOrderedColumns(prevColumns => {
            const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

            let newCardIndex
            const isBelowOverItem = active.rect.current.translated &&
                active.rect.current.translated.top > over.rect.top + over.rect.height
            const modifier = isBelowOverItem ? 1 : 0
            newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
            // Clone mảng OderedColumnsState cũ ra một cái mới để xử lý data rồi return
            const nextColumns = cloneDeep(prevColumns)
            const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
            const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

            //Column cũ
            if (nextActiveColumn) {
                //Xóa card ở cái column active
                nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
                //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
                nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
            }

            //Column mới
            if (nextOverColumn) {
                //kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
                nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
                const rebuild_activeDraggingCardData = {
                    ...activeDraggingCardData,
                    columnId: nextOverColumn._id
                }
                //Tiếp theo là thêm cái card đang kéo vào overcolumn theo vị trí index
                nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
                //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
                nextOverColumn.cards = nextOverColumn.cards.map(card => card._id)

            }

            return nextColumns
        })
    }

    const handleDragStart = (event) => {
        console.log('handleDragStart: ', event)
        setActiveDragItemId(event?.active?.id)
        setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD :
            ACTIVE_DRAG_ITEM_TYPE.COLUMN)
        setActiveDragItemData(event?.active?.data?.current)

        if (event?.active?.data?.current?.columnId) {
            setOldColumnWhenDraggingCard(findColumnByCardId())
        }
    }

    const handleDragOver = (event) => {

        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
        //Còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các columns
        console.log('handleDragOver: ', event)
        const { active, over } = event
        // Can dam bao neu khong ton tai active or over ( khi keo ra pv container ) yhi khong lam gi
        if (!active || !over) return
        //activeDraggingCard: la cai card dang duoc keo
        const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
        const { id: overCardId } = over

        const activeColumn = findColumnByCardId(activeDraggingCardId)
        const overColumn = findColumnByCardId(overCardId)

        //Nếu không tồn tại 1 trong 2 column thì không làm gì hết. Tránh crash web
        if (!activeColumn || !overColumn) return

        if (activeColumn._id !== overColumn._id) {
            moveCardBetweenDifferentColumns(
                overColumn,
                overCardId,
                active,
                over,
                activeColumn,
                activeDraggingCardId,
                activeDraggingCardData
            )
        }
    }

    const handleDragEnd = (event) => {
        console.log('handleDragEnd: ', event)

        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
            //console.log('Hành động kéo thả Card - Tạm thời không làm gì cả!')
            return


        }
        const { active, over } = event

        //Kiem tra nếu không tồn tại over (kéo linh tinh ra ngoài thì luôn tránh lỗi)
        if (!active || !over) return

        // Xử lý kéo thả cards
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
            //activeDraggingCard: la cai card dang duoc keo
            const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
            const { id: overCardId } = over

            const activeColumn = findColumnByCardId(activeDraggingCardId)
            const overColumn = findColumnByCardId(overCardId)

            //Nếu không tồn tại 1 trong 2 column thì không làm gì hết. Tránh crash web
            if (!activeColumn || !overColumn) return
            setOrderedColumns(prevColumns => {
                const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

                let newCardIndex
                const isBelowOverItem = active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height
                const modifier = isBelowOverItem ? 1 : 0
                newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
                // Clone mảng OderedColumnsState cũ ra một cái mới để xử lý data rồi return
                const nextColumns = cloneDeep(prevColumns)
                const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
                const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

                //Column cũ
                if (nextActiveColumn) {
                    //Xóa card ở cái column active
                    nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
                    //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
                    nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
                }

                //Column mới
                if (nextOverColumn) {
                    //kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
                    nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
                    const rebuild_activeDraggingCardData = {
                        ...activeDraggingCardData,
                        columnId: nextOverColumn._id
                    }
                    //Tiếp theo là thêm cái card đang kéo vào overcolumn theo vị trí index
                    nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
                    //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
                    nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)

                }

                return nextColumns
            })
            if (oldColumnWhenDraggingCard._id !== overColumn._id) {
                console.log('Hành động này thả Card - Tạm thời làm gì cả!')
            } else {
                // Hành động kéo thả card trong cùng một cái column
                // Lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard)
                const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === active.id)
                // Lấy vị trí cũ (từ thằng over)
                const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

                // Dùng array move vì kéo card trong 1 column thì tương tự với logic kéo column
                //trong 1 cái board content
                const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

                setOrderedColumns(prevColumns => {
                    // Clone mảng OderedColumnsState cũ ra một cái mới để xử lý data rồi return
                    const nextColumns = cloneDeep(prevColumns)

                    //Tìm tới cái Column mà chúng ta kéo thả
                    const targetColumn = nextColumns.find(column => column._id === overColumn._id)

                    // Cấp nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
                    targetColumn.cards = dndOrderedCards
                    targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
                    return nextColumns
                })

            }

        }

        // Xử lý kéo thả columns
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            //Nếu vị trí sau khi kéo thả khác vị trí ban đầu
            if (active.id !== over.id) {
                // Lấy vị trí cũ (từ thằng active)
                const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
                // Lấy vị trí cũ (từ thằng over)
                const newIndex = orderedColumns.findIndex(c => c._id === over.id)

                const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
                // console.log('dndOrderedColumns: ', dndOrderedColumns)

                setOrderedColumns(dndOrderedColumns)
            }
        }



        //Những dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null mặc định ban đầu
        setActiveDragItemId(null)
        setActiveDragItemType(null)
        setActiveDragItemData(null)
        setOldColumnWhenDraggingCard(null)
    }

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5'
                }
            }
        })
    }
    
    const collisionDetectionStrategy = useCallback((args) => {
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            return closestCorners({...args})
        }

        const pointerCollision = pointerWithin(args)
        
        if (pointerCollision.length > 0) {
            return pointerCollision;
        }

        return rectIntersection(args);
    }, [activeDragItemType])
    return (
        <DndContext
            sensors={sensors}
            //collisionDetection={closestCorners}
            collisionDetection={collisionDetectionStrategy}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <Box sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
                width: '100%',
                height: (theme) => theme.trello.boardContentHeight,
                p: '10px 0'
            }}>
                <ListColumns columns={board?.columns} />
                <DragOverlay>
                    {!activeDragItemType && null}
                    {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
                    {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}

                </DragOverlay>
            </Box>
        </DndContext>

    )
}

export default BoardContent