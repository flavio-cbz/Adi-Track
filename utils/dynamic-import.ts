import dynamic from "next/dynamic"

export const dynamicImport = (componentPath: string, options = {}) => {
  return dynamic(() => import(`@/${componentPath}`), {
    ssr: true,
    loading: () => (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    ),
    ...options,
  })
}
