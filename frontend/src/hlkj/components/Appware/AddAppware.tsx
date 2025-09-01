import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"
import {
  Button,
  DialogActionTrigger,
  DialogTitle,
  Input,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"

import type { ApiError } from "../../../client/core/ApiError"
import useCustomToast from "../../../hooks/useCustomToast"
import { handleError } from "../../../utils"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "../../../components/ui/dialog"
import { Field } from "../../../components/ui/field"
import { NumberInputRoot, NumberInputField } from "../../../components/ui/number-input"
import type { AppWareCreate } from "../../types/appware"
import { AppWaresService } from "../../services/appwares"

const AddAppWare = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AppWareCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
      remark: "",
      sort_order: 0,
      status: 1,
      is_active: true,
      view_count: 0,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: AppWareCreate) =>
      AppWaresService.createAppWare({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("应用仓库创建成功！")
      reset()
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appwares"] })
    },
  })

  const onSubmit: SubmitHandler<AppWareCreate> = (data) => {
    mutation.mutate(data)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button value="add-appware" my={4}>
          <FaPlus fontSize="16px" />
          添加应用仓库
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>添加应用仓库</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>填写下面的信息来添加新的应用仓库。</Text>
            <VStack gap={4}>
              <Field
                required
                invalid={!!errors.name}
                errorText={errors.name?.message}
                label="名称"
              >
                <Input
                  id="name"
                  {...register("name", {
                    required: "名称是必填的。",
                  })}
                  placeholder="请输入应用仓库名称"
                  type="text"
                />
              </Field>

              <Field
                invalid={!!errors.remark}
                errorText={errors.remark?.message}
                label="备注"
              >
                <Input
                  id="remark"
                  {...register("remark")}
                  placeholder="请输入备注信息"
                  type="text"
                />
              </Field>

              <HStack width="full" gap={4}>
                <Field
                  invalid={!!errors.sort_order}
                  errorText={errors.sort_order?.message}
                  label="排序"
                  width="50%"
                >
                  <NumberInputRoot
                    min={0}
                    value={watch("sort_order")?.toString() || ""}
                    onValueChange={(details) => setValue("sort_order", details.valueAsNumber)}
                  >
                    <NumberInputField placeholder="排序号" />
                  </NumberInputRoot>
                </Field>

                <Field
                  invalid={!!errors.status}
                  errorText={errors.status?.message}
                  label="状态"
                  width="50%"
                >
                  <NumberInputRoot
                    min={0}
                    max={1}
                    value={watch("status")?.toString() || ""}
                    onValueChange={(details) => setValue("status", details.valueAsNumber)}
                  >
                    <NumberInputField placeholder="1:启用 0:禁用" />
                  </NumberInputRoot>
                </Field>
              </HStack>

              <Field
                invalid={!!errors.is_active}
                errorText={errors.is_active?.message}
                label="是否激活"
              >
                <input
                  type="checkbox"
                  {...register("is_active")}
                  checked={watch("is_active")}
                  onChange={(e) => setValue("is_active", e.target.checked)}
                />
              </Field>
            </VStack>
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
              type="submit"
              disabled={!isValid}
              loading={isSubmitting}
            >
              保存
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default AddAppWare
