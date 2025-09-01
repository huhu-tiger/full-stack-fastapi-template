import { Button, DialogTitle, Text } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FiTrash2 } from "react-icons/fi"

import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "../../../components/ui/dialog"
import useCustomToast from "../../../hooks/useCustomToast"
import { AppWaresService } from "../../services/appwares"

const DeleteAppWare = ({ id }: { id: number }) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const deleteAppWare = async (id: number) => {
    await AppWaresService.deleteAppWare({ appware_id: id })
  }

  const mutation = useMutation({
    mutationFn: deleteAppWare,
    onSuccess: () => {
      showSuccessToast("应用仓库删除成功")
      setIsOpen(false)
    },
    onError: () => {
      showErrorToast("删除应用仓库时发生错误")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appwares"] })
    },
  })

  const onSubmit = async () => {
    mutation.mutate(id)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      role="alertdialog"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" colorPalette="red">
          <FiTrash2 fontSize="16px" />
          删除应用仓库
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogCloseTrigger />
          <DialogHeader>
            <DialogTitle>删除应用仓库</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>
              该应用仓库将被永久删除。您确定要继续吗？您将无法撤销此操作。
            </Text>
          </DialogBody>

          <DialogFooter gap={2}>
            <DialogActionTrigger asChild>
              <Button
                variant="subtle"
                colorPalette="gray"
                disabled={isSubmitting}
              >
                取消
              </Button>
            </DialogActionTrigger>
            <Button
              variant="solid"
              colorPalette="red"
              type="submit"
              loading={isSubmitting}
            >
              删除
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default DeleteAppWare
