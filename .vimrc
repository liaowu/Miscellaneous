filetype off
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
Plugin 'VundleVim/Vundle.vim'
call vundle#end()
filetype plugin indent on

"安装Github上的插件”
Plugin 'altercation/vim-colors-solarized'
Plugin 'Valloric/YouCompleteMe'
Plugin 'zxqfl/tabnine-vim'
Plugin 'Lokaltog/vim-powerline'
Plugin 'scrooloose/nerdtree'
Plugin 'Yggdroot/indentLine'
Plugin 'jiangmiao/auto-pairs'
Plugin 'tell-k/vim-autopep8'
Plugin 'scrooloose/nerdcommenter'
Plugin 'L9'
Plugin 'rkulla/pydiction'
Plugin 'ctrlpvim/ctrlp.vim' 
Plugin 'dyng/ctrlsf.vim' 
Plugin 'majutsushi/tagbar'
Plugin 'vim-airline/vim-airline'
Plugin 'vim-airline/vim-airline-themes' 
Plugin 'kien/rainbow_parentheses.vim'

"去掉vi的一致性"
set nocompatible
"显示行号"
set number
" 隐藏滚动条"
set guioptions-=r
set guioptions-=L
set guioptions-=b
"隐藏顶部标签栏"
set showtabline=0
"设置字体"
set guifont=Monaco:h13
syntax on   "开启语法高亮"
let g:solarized_termcolors=256  "solarized主题设置在终端下的设置"
set background=dark     "设置背景色"
colorscheme solarized
set nowrap  "设置不折行"
set fileformat=unix "设置以unix的格式保存文件"
set cindent     "设置C样式的缩进格式"
set tabstop=4   "设置table长度"
set shiftwidth=4        "同上"
set showmatch   "显示匹配的括号"
set scrolloff=5     "距离顶部和底部5行"
set laststatus=2    "命令行为两行"
set fenc=utf-8      "文件编码"
set backspace=2
set mouse=a     "启用鼠标"
set selection=exclusive
"set selectmode=mouse, key
set selectmode=
set matchtime=5
set ignorecase      "忽略大小写"
set incsearch
set hlsearch        "高亮搜索项"
set noexpandtab     "不允许扩展table"
set whichwrap+=<,>,h,l
set autoread
set cursorline      "突出显示当前行"
set cursorcolumn        "突出显示当前列"

"缩进指示线"
let g:indentLine_char='┆'
let g:indentLine_enabled=1

"autopep8设置"
let g:autopep8_disable_show_diff=1
           
"按F5运行python"
map <F5> :Autopep8<CR> :w<CR> :call RunPython()<CR>
function RunPython()
    let mp=&makeprg
    let ef=&errorformat
    let exeFile=expand("%:t")
    setlocal makeprg=python\ -u
    set efm=%C\ %.%#,%A\ \ File\ \"%f\"\\,\ line\ %l%.%#,%Z%[%^\ ]%\\@=%m
    silent make %
    copen
    let &makeprg=mp
    let &errorformat=ef
endfunction

"F2开启和关闭树"
map <F2> :NERDTreeToggle<CR>
let NERDTreeChDirMode=1
"显示书签"
let NERDTreeShowBookmarks=1
"忽略文件类型"
let NERDTreeIgnore=['\~$', '\.pyc$', '\.swp$']
"窗口大小"
let NERDTreeWinSize=25

let mapleader = ','

map <F4> <leader>ci <CR>

"pydiction"
let g:pydiction_location = '~/.vim/bundle/pydiction/complete-dict'
let g:pydiction_menu_height = 20

map <F3> :TagbarToggle<CR>

let g:airline_powerline_fonts=1

" 是否启用顶部tabline
let g:airline#extensions#tabline#enabled = 1
" 顶部tabline显示方式
let g:airline#extensions#tabline#left_sep=' '
let g:airline#extensions#tabline#left_alt_sep='|'

"let g:airline_theme="你的主题" 

"rainbow parentheses
let g:rbpt_colorpairs=[['brown','RoyalBlue3'],['Darkblue','SeaGreen3'],['darkgray','DarkOrchid3'],['darkgreen','firebrick3'],['darkcyan','RoyalBlue3'],['darkred','SeaGreen3'],['darkmagenta','DarkOrchid3'],['brown','firebrick3'],['gray','RoyalBlue3'],['black','SeaGreen3'],['darkmagenta','DarkOrchid3'],['Darkblue','firebrick3'],['darkgreen','RoyalBlue3'],['darkcyan','SeaGreen3'],['darkred','DarkOrchid3'],['red','firebrick3']]
let g:rbpt_max = 16
au VimEnter * RainbowParenthesesToggle
au Syntax * RainbowParenthesesLoadRound
au Syntax * RainbowParenthesesLoadSquare
au Syntax * RainbowParenthesesLoadBraces

let g:ctrlsf_debug_mode=1

map f <Plug>CtrlSFPrompt
map F <Plug>CtrlSFQuickfixPrompt

"let g:ycm_server_keep_logfiles = 1
"let g:ycm_server_log_level = 'debug'
